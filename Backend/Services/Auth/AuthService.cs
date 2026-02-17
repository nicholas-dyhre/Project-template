using Backend.Data;
using Backend.Dto;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private readonly ApplicationDbContext _context;

        // In-memory store for refresh tokens (replace with database in production)
        private static readonly Dictionary<string, RefreshTokenData> _refreshTokens = new();

        public AuthService(
            UserManager<IdentityUser> userManager,
            IConfiguration configuration,
            ILogger<AuthService> logger,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _configuration = configuration;
            _logger = logger;
            _context = context;
        }

        public async Task<AuthResult> RegisterAsync(string email, string password, string? fullName = null)
        {
            //try
            //{
            //    // Check if user already exists
            //    var existingUser = await _userManager.FindByEmailAsync(email);
            //    if (existingUser != null)
            //    {
            //        return new AuthResult
            //        {
            //            Success = false,
            //            Message = "User with this email already exists"
            //        };
            //    }

            //    // Create new user
            //    var user = new IdentityUser
            //    {
            //        UserName = email,
            //        Email = email
            //    };

            //    var result = await _userManager.CreateAsync(user, password);

            //    if (!result.Succeeded)
            //    {
            //        return new AuthResult
            //        {
            //            Success = false,
            //            Message = "Validation failed",
            //            Errors = result.Errors
            //                .Select(e => new AuthError
            //                {
            //                    Code = e.Code,
            //                    Description = e.Description
            //                })
            //                .ToList()
            //        };
            //    }

            //    return new AuthResult
            //    {
            //        Success = true,
            //        Message = "Registration successful",
            //        User = new UserDto
            //        {
            //            Id = user.Id,
            //            Email = user.Email!,
            //            FullName = fullName
            //        }
            //    };
            //}
            //catch (Exception ex)
            //{
            //    _logger.LogError(ex, "Error during user registration");
            //    return new AuthResult
            //    {
            //        Success = false,
            //        Message = "An error occurred during registration"
            //    };
            //}

            try
            {
                // Check if user already exists in Identity
                var existingIdentity = await _userManager.FindByEmailAsync(email);
                if (existingIdentity != null)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "User with this email already exists"
                    };
                }

                // Create IdentityUser and AppUser in one step
                var (identityUser, appUser, errors) = await CreateDatabaseUserAsync(email, password, fullName);
                if (errors.Any())
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = errors
                    };
                }

                return new AuthResult
                {
                    Success = true,
                    Message = "Registration successful",
                    User = new UserDto
                    {
                        identityUserId = identityUser.Id.ToString(),
                        Email = appUser.Email,
                        FullName = fullName
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during user registration");
                return new AuthResult
                {
                    Success = false,
                    Message = "An error occurred during registration"
                };
            }
        }

        public async Task<AuthResult> LoginAsync(string email, string password)
        {
            try
            {
                var identityUser = await _userManager.FindByEmailAsync(email);
                if (identityUser == null)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var isPasswordValid = await _userManager.CheckPasswordAsync(identityUser, password);
                if (!isPasswordValid)
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    };
                }

                var accessToken = GenerateAccessToken(identityUser);
                var refreshToken = GenerateRefreshToken();

                // Store refresh token
                _refreshTokens[refreshToken] = new RefreshTokenData
                {
                    UserId = identityUser.Id,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };

                return new AuthResult
                {
                    Success = true,
                    Message = "Login successful",
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    User = new UserDto
                    {
                        identityUserId = identityUser.Id,
                        Email = identityUser.Email!
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return new AuthResult
                {
                    Success = false,
                    Message = "An error occurred during login"
                };
            }
        }

        public async Task<AuthResult> RefreshTokenAsync(string refreshToken)
        {
            try
            {
                // Validate refresh token
                if (!_refreshTokens.TryGetValue(refreshToken, out var tokenData))
                {
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Invalid refresh token"
                    };
                }

                if (tokenData.ExpiresAt < DateTime.UtcNow)
                {
                    _refreshTokens.Remove(refreshToken);
                    return new AuthResult
                    {
                        Success = false,
                        Message = "Refresh token expired"
                    };
                }

                // Get user
                var identityUser = await _userManager.FindByIdAsync(tokenData.UserId);
                if (identityUser == null)
                {
                    _refreshTokens.Remove(refreshToken);
                    return new AuthResult
                    {
                        Success = false,
                        Message = "User not found"
                    };
                }

                // Generate new tokens
                var newAccessToken = GenerateAccessToken(identityUser);
                var newRefreshToken = GenerateRefreshToken();

                // Remove old refresh token and store new one
                _refreshTokens.Remove(refreshToken);
                _refreshTokens[newRefreshToken] = new RefreshTokenData
                {
                    UserId = identityUser.Id,
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };

                return new AuthResult
                {
                    Success = true,
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    User = new UserDto
                    {
                        identityUserId = identityUser.Id,
                        Email = identityUser.Email!
                    }
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return new AuthResult
                {
                    Success = false,
                    Message = "An error occurred during token refresh"
                };
            }
        }

        public Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            return Task.FromResult(_refreshTokens.Remove(refreshToken));
        }

        public async Task<UserDto?> GetUserByIdAsync(string userId)
        {
            var identityUser = await _userManager.FindByIdAsync(userId);
            if (identityUser == null)
            {
                return null;
            }

            return new UserDto
            {
                identityUserId = identityUser.Id,
                Email = identityUser.Email!
            };
        }

        private async Task<(IdentityUser identityUser, AppUser? appUser, List<AuthError> errors)> CreateDatabaseUserAsync(
        string email, string password, string? fullName)
        {
            var errors = new List<AuthError>();

            var identityUser = new IdentityUser
            {
                UserName = email,
                Email = email
            };
            var result = await _userManager.CreateAsync(identityUser, password);

            if (!result.Succeeded)
            {
                errors.AddRange(result.Errors.Select(e => new AuthError
                {
                    Code = e.Code,
                    Description = e.Description
                }));
                return (identityUser, null, errors);
            }

            var appUser = new AppUser
            {
                Id = Guid.NewGuid(),
                Email = email,
                Name = fullName ?? email.Split('@')[0],
                IdentityUserId = identityUser.Id,
                Basket = new Basket()
            };

            _context.AppUsers.Add(appUser);
            await _context.SaveChangesAsync();

            return (identityUser, appUser, errors);
        }

        private string GenerateAccessToken(IdentityUser user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
            var issuer = jwtSettings["Issuer"] ?? "YourApp";
            var audience = jwtSettings["Audience"] ?? "YourAppUsers";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }
    }
}
