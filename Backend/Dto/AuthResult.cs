using System.ComponentModel.DataAnnotations;

namespace Backend.Dto
{
    public class AuthResult
    {
        [Required]
        public bool Success { get; set; }
        [Required]
        public string Message { get; set; } = string.Empty;
        [Required]
        public string AccessToken { get; set; } = string.Empty;
        [Required]
        public string RefreshToken { get; set; } = string.Empty;
        [Required]
        public UserDto? User { get; set; }
        [Required]
        public List<AuthError> Errors { get; set; } = new List<AuthError>();
    }
}
