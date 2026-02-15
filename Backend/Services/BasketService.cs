using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class BasketService : IBasketService
    {
        private readonly ApplicationDbContext _context;

        public BasketService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Basket?> GetBasketAsync(Guid basketId)
        {
            return await _context.Baskets
                .Include(b => b.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(b => b.Id == basketId);
        }

        public async Task AddProductToBasketAsync(Guid basketId, int productId)
        {
            Console.WriteLine("Product ID to add: " + productId);
            var basket = await GetBasketAsync(basketId)
                         ?? throw new KeyNotFoundException("Basket not found");

            

            var basketItem = basket.Items.FirstOrDefault(i => i.ProductId == productId);

            if (basketItem != null)
            {
                basketItem.Quantity++;
            }
            else
            {
                var product = await _context.Products.FindAsync(productId) ?? throw new KeyNotFoundException("Product not found");
                basket.Items.Add(new BasketItem
                {
                    ProductId = productId,
                    Product = product,
                    Quantity = 1
                });
            }

            await _context.SaveChangesAsync();
        }

        public async Task RemoveProductFromBasketAsync(Guid basketId, int productId)
        {
            var basket = await GetBasketAsync(basketId)
                         ?? throw new KeyNotFoundException("Basket not found");

            var item = basket.Items.FirstOrDefault(i => i.ProductId == productId);
            if (item != null)
            {
                basket.Items.Remove(item);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SetProductQuantityAsync(Guid basketId, int productId, int quantity)
        {
            if (quantity < 1)
                throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be at least 1");

            var basket = await GetBasketAsync(basketId)
                         ?? throw new KeyNotFoundException("Basket not found");

            var basketItem = basket.Items.FirstOrDefault(i => i.ProductId == productId);

            if (basketItem == null)
                throw new KeyNotFoundException("Product not in basket");

            basketItem.Quantity = quantity;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteBasketAsync(Guid basketId)
        {
            var basket = await _context.Baskets.FindAsync(basketId);
            if (basket == null) return;

            _context.Baskets.Remove(basket);
            await _context.SaveChangesAsync();
        }

        public async Task<Guid?> CreateBasket()
        {
            var basket = new Basket()
            {
                Id = new Guid(),
                Items = new List<BasketItem>(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                //IdentityUserId = IdentityUserId
            };
            _context.Baskets.Add(basket);
            await _context.SaveChangesAsync();
            return basket.Id;
        }

        public async  Task<decimal> GetBasketTotal(Guid basketId)
        {
            var basket = await _context.Baskets
                .Include(b => b.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(b => b.Id == basketId);

            if (basket == null)
            {
                throw new KeyNotFoundException("Basket not found");
            }
            if( basket.Items.Count == 0)
            {
                return 0;
            }

            return basket.Items.Sum(i => i.Product.Price * i.Quantity);
        }
    }
}
