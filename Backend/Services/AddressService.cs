using Backend.Data;
using Backend.Dto;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services
{
    public class AddressService : IAddressService
    {
        private readonly ApplicationDbContext _context;

        public AddressService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Address> GetOrCreateAddressAsync(AddressDto newAddressDto)
        {
            var existing = await _context.Addresses
                .FirstOrDefaultAsync(a =>
                    a.Street == newAddressDto.Street &&
                    a.City == newAddressDto.City &&
                    a.State == newAddressDto.State &&
                    a.ZipCode == newAddressDto.ZipCode &&
                    a.Country == newAddressDto.Country
                );

            if (existing != null)
            {
                return existing;
            }

            var newAddress = new Address
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.UtcNow,
                City = newAddressDto.City,
                Country = newAddressDto.Country,
                State = newAddressDto.State,
                ZipCode = newAddressDto.ZipCode,
                Street = newAddressDto.Street
            };

            _context.Addresses.Add(newAddress);
            await _context.SaveChangesAsync();

            return newAddress;
        }
    }
}
