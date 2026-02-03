using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public interface IProductsService
    {
        Task<List<Product>> GetProductsAsync();
        
        Task<Product?> GetProductAsync(int id);

        Task<Product> PostProductAsync(Product product);
        
        Task<Product?> PutProductAsync(int id, Product product);
        
        Task<bool> DeleteProductAsync(int id);

    }
}
