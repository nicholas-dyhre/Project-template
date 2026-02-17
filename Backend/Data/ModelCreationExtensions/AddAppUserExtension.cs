using Backend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Backend.Data.ModelCreationExtensions
{
    public static class UserCreationExtensions
    {
        public static ModelBuilder AddAppUser(this ModelBuilder modelBuilder)
        {
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

            modelBuilder.Entity<AppUser>()
                .HasIndex(u => u.IdentityUserId)
                .IsUnique();

            return modelBuilder;
        }
    }
}
