using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.ModelCreationExtensions
{
    public static class AddProductExtension
    {
        public static ModelBuilder AddProduct(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.OwnsOne(p => p.Specification);
            });
            return modelBuilder;
        }
    }
}
