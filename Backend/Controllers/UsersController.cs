using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IOrderService _orderService;
        public UsersController(
            IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpGet("{userId:guid}/orders")]
        public async Task<ActionResult<IEnumerable<Order>>> GetOrdersForUser(Guid userId)
        {
            var orders = await _orderService.GetOrders(userId);
            return Ok(orders);
        }
    }
}