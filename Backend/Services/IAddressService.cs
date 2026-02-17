using Backend.Dto;

namespace Backend.Services
{
    public interface IAddressService
    {
        Task<Address> GetOrCreateAddressAsync(AddressDto newAddressDto);
    }
}
