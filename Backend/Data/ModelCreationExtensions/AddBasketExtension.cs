using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data.ModelCreationExtensions
{
    public static class AddBasketExtensions
    {
        public static ModelBuilder AddBasket(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Basket>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasOne(b => b.IdentityUser)
                    .WithMany()
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

            return modelBuilder;
        }
    }
}
