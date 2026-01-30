using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

[Owned]
public class Specification
{
    public string[] Materials { get; set; } = Array.Empty<string>();
    public string Dimensions { get; set; } = string.Empty;
    public string Care { get; set; } = string.Empty;

    private Specification() { }

    public Specification(string[] materials, string dimensions, string care)
    {
        Materials = materials;
        Dimensions = dimensions;
        Care = care;
    }
}