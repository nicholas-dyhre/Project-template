using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public OrderController(
            IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("{orderId:guid}")]
        public async Task<ActionResult<Order>> GetOrder(Guid orderId)
        {
            var order = await _orderService.GetOrder(orderId);

            if (order == null)
                return NotFound();

            return Ok(order);
        }
    }
}