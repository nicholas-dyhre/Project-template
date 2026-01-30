using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public Specification Specification { get; set; } = new Specification(Array.Empty<string>(), string.Empty, string.Empty);

    public int CategoryId { get; set; }
    public Category? Category { get; set; }

    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}