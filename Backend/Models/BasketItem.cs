using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Backend.Models;

public class BasketItem
{
    [Required]
    [Key]
    public int Id { get; set; }

    [Required]
    public Guid BasketId { get; set; }
    [Required]
    public int ProductId { get; set; }
    [Required]
    public int Quantity { get; set; }
    [Required]
    [JsonIgnore]
    public virtual Basket Basket { get; set; } = null!;
    [Required]
    public virtual Product Product { get; set; } = null!;

    public OrderItem ToOrderItem(Guid orderId)
    {
        return new OrderItem
        {
            OrderId = orderId,
            ProductId = this.Product.Id,
            Product = this.Product,
            Quantity = this.Quantity,
            Price = this.Product.Price
        };
    }
}