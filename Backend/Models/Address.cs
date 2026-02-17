using Backend.Dto;
using Backend.Models;
using System.ComponentModel.DataAnnotations;

public class Address
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Street { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    [Required]
    public string State { get; set; } = string.Empty;

    [Required]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
