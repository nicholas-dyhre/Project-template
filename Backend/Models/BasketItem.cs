using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class BasketItem
{
    public int Id { get; set; }
    public int BasketId { get; set; }
    [JsonIgnore]
    public Basket? Basket { get; set; }
    public int ProductId { get; set; }
    public required Product Product { get; set; }

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}