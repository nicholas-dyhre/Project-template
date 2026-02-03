using Backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Services
{
    public interface IBasketService
    {
        Task<Basket?> GetBasketAsync(int basketId);
        Task AddProductToBasketAsync(int basketId, int productId);
        Task RemoveProductFromBasketAsync(int basketId, int productId);
        Task SetProductQuantityAsync(int basketId, int productId, int quantity);
        Task DeleteBasketAsync(int basketId);
        Task<int?> CreateBasket();
        Task<decimal> GetBasketTotal(int basketId);
    }
}
