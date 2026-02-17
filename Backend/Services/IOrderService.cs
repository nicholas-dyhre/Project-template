using Backend.Models;

namespace Backend.Services
{
    public interface IOrderService
    {
        Task<Order?> GetOrder(Guid orderId);
        Task<Order[]?> GetOrders(Guid userId);
        Task<Order?> CreateOrder(Guid basketId, Guid shippingAddressId, Guid billingAddressId);
    }
}
