
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Backend.Services
{
    public class OrderService : IOrderService
    {
        private readonly ApplicationDbContext _context;
        private readonly IBasketService _basketService;

        public OrderService(ApplicationDbContext context, IBasketService basketService)
        {
            _context = context;
            _basketService = basketService;
        }

        public async Task<Order?> GetOrder(Guid orderId)
        {
            return await _context.Orders
                .Include(o => o.Items)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }

        public async Task<Order[]?> GetOrders(Guid userId)
        {
            return await _context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.Items)
                .ToArrayAsync();
        }

        public async Task<Order?> CreateOrder(Guid basketId, Guid shippingAddressId, Guid billingAddressId)
        {
            var basket = await _basketService.GetBasketAsync(basketId);
            if(basket == null || basket.Items == null) {
                return null;
            }

            var id = new Guid();
            var order = new Order()
            {
                Id = id,
                Total = await _basketService.GetBasketTotal(basketId),
                ShippingAddressId = shippingAddressId,
                BillingAddressId = billingAddressId,
                Items = basket.Items.Select(i => i.ToOrderItem(id)).ToList()
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;
        }
    }
}
