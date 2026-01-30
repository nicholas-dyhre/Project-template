using Backend.Models;

namespace Backend.Data;

public static class DataSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        // Seed Categories
        if (!context.Categories.Any())
        {
            var categories = new List<Category>
            {
                new() { Name = "Home & Kitchen" },
                new() { Name = "Handcrafted Goods" },
                new() { Name = "Decor" }
            };
            context.Categories.AddRange(categories);
            context.SaveChanges();
        }

        // Seed Products
        if (!context.Products.Any())
        {
            var products = new List<Product>
            {
                new() {
                    Name = "Handcrafted Wooden Bowl",
                    Description = "This beautifully handcrafted wooden bowl is carved from sustainably sourced hardwood. Each piece is unique, featuring natural wood grain patterns and a smooth, food-safe finish.",
                    Price = 45.00m,
                    ImageUrl = "https://via.placeholder.com/600x600?text=Wooden+Bowl",
                    Specification = new Specification(["Sustainably sourced hardwood", "Food-safe natural oil finish", "Hand-sanded"], "8 diameter x 3 height", "Hand wash only"),
                    CategoryId = 1,
                    Stock = 10
                },
                new() {
                    Name = "Ceramic Coffee Mug",
                    Description = "A hand-thrown ceramic coffee mug with a unique glaze pattern. Perfect for your morning coffee or tea.",
                    Price = 25.00m,
                    ImageUrl = "https://via.placeholder.com/600x600?text=Ceramic+Mug",
                    Specification = new Specification(["High-quality ceramic", "Lead-free glaze"], "4 height x 3.5 diameter, 12 oz", "Dishwasher safe"),
                    CategoryId = 1,
                    Stock = 15
                },
                new() {
                    Name = "Woven Basket",
                    Description = "Handwoven basket made from natural fibers. Great for storage or as a decorative piece.",
                    Price = 35.00m,
                    ImageUrl = "https://via.placeholder.com/600x600?text=Woven+Basket",
                    Specification = new Specification(["Natural fibers, Sustainable sourcing"], "12 diameter x 8 height", "Spot clean only"),
                    CategoryId = 2,
                    Stock = 8
                }
            };
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}