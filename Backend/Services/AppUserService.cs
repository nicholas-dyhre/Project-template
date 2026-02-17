using Backend.Data;
using Backend.Dto;
using Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend.Services
{
    public class AppUserService : IAppUserService
    {
        private readonly ApplicationDbContext _context;

        public AppUserService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AppUser> AddAddressToUser(string identityUserId, Address billingAddress, Address shippingAddress)
        {
            var existing = await _context.AppUsers
                    .FirstOrDefaultAsync(u =>
                        u.IdentityUserId == identityUserId);

            if (existing == null)
            {
                throw new Exception("User not found");
            }

            existing.BillingAddress = billingAddress;
            existing.ShippingAddress = shippingAddress;

            await _context.SaveChangesAsync();
            return existing;
        }
    }
}
