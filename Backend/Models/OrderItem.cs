using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class OrderItem
{
    [Required]
    public Guid Id { get; set; }
    [Required]
    public Guid OrderId { get; set; }
    [Required, JsonIgnore]
    public Order? Order { get; set; }
    [Required]
    public int ProductId { get; set; }
    [Required]
    public Product Product { get; set; }
    [Required]
    public int Quantity { get; set; }
    [Required]
    public decimal Price { get; set; }
}