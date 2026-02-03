using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Product
{
    [Required]
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Description { get; set; } = string.Empty;

    [Required]
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Required]
    public string ImageUrl { get; set; } = string.Empty;

    [Required]
    public Specification Specification { get; set; } = new Specification(Array.Empty<string>(), string.Empty, string.Empty);

    [Required]
    public int CategoryId { get; set; }

    [Required]
    public Category? Category { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Stock { get; set; }
}