using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Basket
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid(); 
    public string? IdentityUserId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public virtual IdentityUser? IdentityUser { get; set; }
    public virtual ICollection<BasketItem> Items { get; set; } = new List<BasketItem>();
}