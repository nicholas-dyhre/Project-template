using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BasketController : ControllerBase
{
    private readonly IBasketService _basketService;

    public BasketController(IBasketService basketService)
    {
        _basketService = basketService;
    }

    [HttpGet("{basketId}")]
    public async Task<ActionResult<Basket>> GetBasket(Guid basketId)
    {
        var basket = await _basketService.GetBasketAsync(basketId);
        if (basket == null) return NotFound();
        return Ok(basket);
    }

    [HttpPut("add/{basketId}/{productId}")]
    public async Task<IActionResult> AddProductToBasket(Guid basketId, int productId)
    {
        Console.WriteLine(@"Adding {productId} to {basketId} a new basket");
        await _basketService.AddProductToBasketAsync(basketId, productId);
        return NoContent();
    }

    [HttpPut("remove/{basketId}/{productId}")]
    public async Task<IActionResult> RemoveProductFromBasket(Guid basketId, int productId)
    {
        await _basketService.RemoveProductFromBasketAsync(basketId, productId);
        return NoContent();
    }

    [HttpPut("set-quantity/{basketId}/{productId}/{quantity}")]
    public async Task<IActionResult> SetProductQuantity(Guid basketId, int productId, int quantity)
    {
        await _basketService.SetProductQuantityAsync(basketId, productId, quantity);
        return NoContent();
    }

    [HttpDelete("{basketId}")]
    public async Task<IActionResult> DeleteBasket(Guid basketId)
    {
        await _basketService.DeleteBasketAsync(basketId);
        return NoContent();
    }

    [HttpPost("create")]
    public async Task<ActionResult<Guid>> CreateBasket()
    {
        Console.WriteLine("Creating a new basket");
        var basketId = await _basketService.CreateBasket();
        return Ok(basketId);
    }

    [HttpGet("total/{basketId}")]
    public async Task<ActionResult<int>> GetBasketTotal(Guid basketId)
    {
        var total = await _basketService.GetBasketTotal(basketId);
        return Ok(total);
    }
}
