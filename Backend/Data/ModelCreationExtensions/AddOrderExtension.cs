using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.ModelCreationExtensions
{
    public static class AddOrderExtension
    {
        public static ModelBuilder AddOrder(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasOne(o => o.Payment)
                      .WithOne(p => p.Order)
                      .HasForeignKey<Payment>(p => p.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(o => o.ShippingAddress)
                      .WithMany()
                      .HasForeignKey(o => o.ShippingAddressId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.BillingAddress)
                      .WithMany()
                      .HasForeignKey(o => o.BillingAddressId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(o => o.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(o => o.UserId)
                      .IsRequired(false)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(oi => oi.Id);
                entity.HasOne(oi => oi.Order)
                      .WithMany(o => o.Items)
                      .HasForeignKey(oi => oi.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            return modelBuilder;
        }
    }
}
