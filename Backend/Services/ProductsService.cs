using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class ProductsService : IProductsService
    {
        private readonly ApplicationDbContext _context;

        public ProductsService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetProductsAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(c => c.Specification)
                .ToListAsync();
        }

        public async Task<Product?> GetProductAsync(int id)
        {
            return await _context.Products
                .Include(p => p.Category)
                .Include(c => c.Specification)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> PostProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> PutProductAsync(int id, Product product)
        {
            if (id != product.Id)
            {
                throw new ArgumentException("Product ID mismatch");
            }

            _context.Entry(product).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
