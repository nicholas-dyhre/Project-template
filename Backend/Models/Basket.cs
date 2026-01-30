namespace Backend.Models;

public class Basket
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public ICollection<BasketItem> Items { get; set; } = new List<BasketItem>();
}