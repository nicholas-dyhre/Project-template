namespace Backend.Models;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string TransactionId { get; set; } = string.Empty;
}