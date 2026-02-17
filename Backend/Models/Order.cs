using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class Order
{
    [Required]
    public Guid Id { get; set; }

    public Guid? UserId { get; set; }
    public AppUser? User { get; set; }

    [Required]
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    [Required]
    public decimal Total { get; set; }
    [Required]
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public Guid ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; }

    [Required]
    public Guid BillingAddressId { get; set; }
    [Required]
    public Address BillingAddress { get; set; }

    [Required]
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();

    public Payment? Payment { get; set; }
}
