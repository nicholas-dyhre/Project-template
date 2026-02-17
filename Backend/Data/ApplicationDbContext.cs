using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Backend.Data.ModelCreationExtensions;

namespace Backend.Data;

public class ApplicationDbContext : IdentityDbContext<IdentityUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Product> Products { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<Basket> Baskets { get; set; }
    public DbSet<BasketItem> BasketItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Payment> Payments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // IMPORTANT: Call base.OnModelCreating to configure Identity tables
        base.OnModelCreating(modelBuilder);

        // Your existing model configurations
        modelBuilder
            .AddProduct()
            .AddBasket()
            .AddAppUser()
            .AddOrder();
    }
}