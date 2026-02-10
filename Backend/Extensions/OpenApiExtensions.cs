using Backend.Data;
using Microsoft.AspNetCore.Identity;

namespace Backend.Extensions
{
    public static class OpenApiExtensions
    {
        public static IServiceCollection AddOpenApiServiceRules(this IServiceCollection services)
        {
            services.AddOpenApiDocument(configure =>
            {
                configure.DocumentName = "v1";
                configure.Version = "v1";
                configure.Title = "API";
            });
            return services;
        }
    }
}
