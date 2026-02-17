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
        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Description).HasMaxLength(1000);
            entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
            entity.OwnsOne(p => p.Specification);
        });

        modelBuilder.Entity<Basket>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(b => b.IdentityUser)           // Use navigation property here
              .WithMany()                    // IdentityUser does not need a collection of baskets
              .HasForeignKey(b => b.IdentityUserId)
              .OnDelete(DeleteBehavior.ClientSetNull)
              .IsRequired(false);
        });

        modelBuilder.Entity<BasketItem>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasOne(e => e.Basket)
                .WithMany(b => b.Items)
                .HasForeignKey(e => e.BasketId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Product)
                .WithMany()
                .HasForeignKey(e => e.ProductId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AppUser>()
        .HasOne(u => u.BillingAddress)
        .WithMany()
        .IsRequired(false);

        modelBuilder.Entity<AppUser>()
        .HasOne(u => u.ShippingAddress)
        .WithMany()
        .IsRequired(false);

        modelBuilder.Entity<AppUser>()
            .HasMany(u => u.Orders)
            .WithOne(o => o.User)
            .HasForeignKey(o => o.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AppUser>()
        .HasOne<IdentityUser>()
        .WithMany()
        .HasForeignKey(u => u.IdentityUserId)
        .IsRequired(false)
        .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<OrderItem>()
            .HasKey(oi => oi.Id);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.Payment)
            .WithOne(p => p.Order)
            .HasForeignKey<Payment>(p => p.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.BillingAddress)
            .WithMany()
            .HasForeignKey(o => o.BillingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId)
            .IsRequired(false)        // allow null for guests
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AppUser>()
            .HasIndex(u => u.IdentityUserId)
            .IsUnique();

    }
}