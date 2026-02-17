using Backend.Models;

public class Payment
{
    public Guid Id { get; set; }

    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string TransactionId { get; set; } = string.Empty;
}
