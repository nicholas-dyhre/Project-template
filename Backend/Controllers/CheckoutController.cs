using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CheckoutController : ControllerBase
    {
        //private readonly ICheckoutService _checkoutService;
        private readonly IBasketService _basketService;
        public CheckoutController(
            //ICheckoutService checkoutService, 
            IBasketService basketService)
        {
            //_checkoutService = checkoutService;
            _basketService = basketService;
        }

        [HttpGet("{basketId}")]
        public async Task<ActionResult<bool>> Checkout(Guid basketId)
        {
            await _basketService.DeleteBasketAsync(basketId);
            return Ok();
        }
    }
}