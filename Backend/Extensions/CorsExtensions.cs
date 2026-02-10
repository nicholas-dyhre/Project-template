using Backend.Data;
using Microsoft.AspNetCore.Identity;

namespace Backend.Extensions
{
    public static class CorsExtensions
    {

        public static IServiceCollection AddCorsServiceRules(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularApp", policy =>
                {
                    policy.WithOrigins("http://localhost:4200")
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });
            return services;
        }
    }
}
