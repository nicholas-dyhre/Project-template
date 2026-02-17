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
        public static ModelBuilder AddUser(this ModelBuilder modelBuilder)
        {
             //modelBuilder.Entity<User>()
             //   .HasOne(u => u.Address)
             //   .WithOne(a => a.User)
             //   .HasForeignKey<Address>(a => a.UserId)
             //   .OnDelete(DeleteBehavior.Cascade);

            return modelBuilder;
        }
    }
}
