using Backend.Dto;

namespace Backend.Services
{
    public interface IAppUserService
    {
        public Task<AppUser> AddAddressToUser(string identityUserId, Address billingAddress, Address shippingAddress);
    }
}
