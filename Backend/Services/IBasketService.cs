using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public interface IBasketService
    {
        Task<Basket?> GetBasketAsync(Guid basketId);
        Task AddProductToBasketAsync(Guid basketId, int productId);
        Task RemoveProductFromBasketAsync(Guid basketId, int productId);
        Task SetProductQuantityAsync(Guid basketId, int productId, int quantity);
        Task DeleteBasketAsync(Guid basketId);
        Task<Guid?> CreateBasket();
        Task<decimal> GetBasketTotal(Guid basketId);
    }
}
