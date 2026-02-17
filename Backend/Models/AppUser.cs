using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class AppUser
{
    [Required]
    public Guid Id { get; set; }

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    [Required]
    public string Name { get; set; } = string.Empty;

    public string? IdentityUserId { get; set; }

    [Required]
    public Basket Basket { get; set; } = new Basket();
    public ICollection<Order> Orders { get; set; } = new List<Order>();

    public Address? BillingAddress { get; set; }
    public Address? ShippingAddress { get; set; }
}