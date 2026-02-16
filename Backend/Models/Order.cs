namespace Backend.Models;

public class Order
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public DateTime OrderDate { get; set; } = DateTime.UtcNow;
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public int ShippingAddressId { get; set; }
    public Address? ShippingAddress { get; set; }
    public int BillingAddressId { get; set; }
    public Address? BillingAddress { get; set; }
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
    public Payment? Payment { get; set; }
}