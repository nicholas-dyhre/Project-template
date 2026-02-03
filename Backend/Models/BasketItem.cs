using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class BasketItem
{
    [Required]
    public int Id { get; set; }

    [Required]
    public int BasketId { get; set; }

    [JsonIgnore]
    public Basket? Basket { get; set; }

    [Required]
    public int ProductId { get; set; }

    [Required]
    public required Product Product { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }
}