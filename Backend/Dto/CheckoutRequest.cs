namespace Backend.Dto
{
    public class CheckoutRequest
    {
        public string? IdentityUserId { get; set; } // null = guest

        public AddressDto ShippingAddress { get; set; } = null!;
        public AddressDto BillingAddress { get; set; } = null!;
    }
}
