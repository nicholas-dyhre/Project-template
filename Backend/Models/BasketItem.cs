using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class BasketItem
{
    public int Id { get; set; }
    public int BasketId { get; set; }
    public Basket? Basket { get; set; }
    public int ProductId { get; set; }
    public Product? Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}