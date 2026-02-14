using Backend.Dto;
using Backend.Models;
using Backend.Services.Auth;
using Microsoft.AspNetCore.Authentication.BearerToken;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResult), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(AuthResult), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(AuthResult), StatusCodes.Status422UnprocessableEntity)]
        public async Task<ActionResult<AuthResult>> Register([FromBody] RegisterRequest request)
        {
            var result = await _authService.RegisterAsync(request.Email, request.Password, request.FullName);

            if (!result.Success)
            {
                var response = new AuthResult
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors
                };

                if (result.Message.Contains("exists"))
                    return Conflict(response); // 409

                return UnprocessableEntity(response); // 422
            }

            SetRefreshTokenCookie(result.RefreshToken);

            return Created("", new AuthResult
            {
                Success = true,
                Message = "Registration successful",
                User = result.User
            });
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResult), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(AuthResult), StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<AuthResult>> Login([FromBody] LoginRequest request)
        {
            var result = await _authService.LoginAsync(request.Email, request.Password);

            if (!result.Success)
            {
                var response = new AuthResult
                {
                    Success = false,
                    Message = result.Message,
                    Errors = result.Errors,
                    AccessToken = "",
                    RefreshToken = "",
                    User = null
                };

                return BadRequest(response);
            }

            SetRefreshTokenCookie(result.RefreshToken);

            return Ok(new AuthResult
            {
                Success = true,
                Message = "Login successful",
                AccessToken = result.AccessToken,
                RefreshToken = result.RefreshToken,
                User = result.User
            });
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult<AuthResult>> RefreshToken()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                
                if (string.IsNullOrEmpty(refreshToken))
                {
                    return Unauthorized(new { message = "Refresh token not found" });
                }

                var result = await _authService.RefreshTokenAsync(refreshToken);
                
                if (!result.Success)
                {
                    return Unauthorized(new { message = result.Message });
                }

                // Set new refresh token in HttpOnly cookie
                SetRefreshTokenCookie(result.RefreshToken);

                return Ok(new 
                { 
                    accessToken = result.AccessToken,
                    user = result.User
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { message = "An error occurred during token refresh" });
            }
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                
                if (!string.IsNullOrEmpty(refreshToken))
                {
                    await _authService.RevokeRefreshTokenAsync(refreshToken);
                }

                // Clear refresh token cookie
                Response.Cookies.Delete("refreshToken");

                return Ok(new { message = "Logged out successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during logout");
                return StatusCode(500, new { message = "An error occurred during logout" });
            }
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { message = "User not found" });
                }

                var user = await _authService.GetUserByIdAsync(userId);
                
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting current user");
                return StatusCode(500, new { message = "An error occurred" });
            }
        }

        private void SetRefreshTokenCookie(string refreshToken)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, // Set to true in production (requires HTTPS)
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
        }
    }
}
