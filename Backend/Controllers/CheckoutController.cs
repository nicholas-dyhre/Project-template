using Backend.Dto;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        private readonly IBasketService _basketService;
        private readonly IOrderService _orderService;
        private readonly IAddressService _addressService;
        private readonly IAppUserService _appUserService;

        public CheckoutController(
            IOrderService orderService,
            IBasketService basketService,
            IAddressService addressService,
            IAppUserService appUserService)
        {
            _basketService = basketService;
            _orderService = orderService;
            _addressService = addressService;
            _appUserService = appUserService;
        }

        [HttpPost("{basketId}/checkout")]
        public async Task<ActionResult<Order>> Checkout(
            Guid basketId,
            [FromBody] CheckoutRequest request)
        {
            // If user is authenticated, get userId from claims instead
            string? identityUserId = request.identityUserId;

            var shippingAddress =
                await _addressService.GetOrCreateAddressAsync(request.ShippingAddress);

            var billingAddress =
                await _addressService.GetOrCreateAddressAsync(request.BillingAddress);

            var order = await _orderService.CreateOrder(
                basketId,
                shippingAddress.Id,
                billingAddress.Id);

            if(order == null)
            {
                return BadRequest("Order couldn't be created");
            }

            if(identityUserId != null) // Save new address to user
            {
                await _appUserService.AddAddressToUser(identityUserId, shippingAddress, billingAddress);
            }

            await _basketService.DeleteBasketAsync(basketId);

            return order;
        }
    }
}