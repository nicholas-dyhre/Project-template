using Backend.Dto;

namespace Backend.Services.Auth
{
    public interface IAuthService
    {
        Task<AuthResult> RegisterAsync(string email, string password, string? fullName = null);
        Task<AuthResult> LoginAsync(string email, string password);
        Task<AuthResult> RefreshTokenAsync(string refreshToken);
        Task<bool> RevokeRefreshTokenAsync(string refreshToken);
        Task<UserDto?> GetUserByIdAsync(string userId);
    }
}
