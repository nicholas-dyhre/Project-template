namespace Backend.Models;

public class Payment
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public Order? Order { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public string TransactionId { get; set; } = string.Empty;
}