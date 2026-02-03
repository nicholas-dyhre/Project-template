using Microsoft.AspNetCore.Mvc;
using Backend.Models;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductsService _productService;

    public ProductsController(IProductsService productService)
    {
        _productService = productService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _productService.GetProductsAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await _productService.GetProductAsync(id);
        if (product == null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {
        var created = await _productService.PostProductAsync(product);
        return CreatedAtAction(nameof(GetProduct), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutProduct(int id, Product product)
    {
        try
        {
            await _productService.PutProductAsync(id, product);
            return NoContent();
        }
        catch (ArgumentException)
        {
            return BadRequest();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var success = await _productService.DeleteProductAsync(id);
        if (!success) return NotFound();
        return NoContent();
    }
}
