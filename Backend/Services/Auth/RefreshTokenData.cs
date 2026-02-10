namespace Backend.Services.Auth
{
    internal class RefreshTokenData
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }
}
