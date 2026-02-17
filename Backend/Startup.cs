using Backend.Data;
using Backend.Extensions;
using Backend.Services;
using Backend.Services.Auth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Backend
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // -------------------- SERVICES --------------------
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<IProductsService, ProductsService>();
            services.AddTransient<IBasketService, BasketService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddTransient<IOrderService, OrderService>();
            services.AddTransient<IAddressService, AddressService>();
            services.AddTransient<IAppUserService, AppUserService>();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddControllers();

            // Extensions
            services.AddIdentityServiceRules();

            var jwtSettings = Configuration.GetSection("JwtSettings");
            services.AddAuthenticationServiceRules(jwtSettings, Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"));

            services.AddCorsServiceRules();

            services.AddOpenApiServiceRules();
        }

        // -------------------- MIDDLEWARE --------------------
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Seed DB (skip for NSwag)
            if (!env.IsEnvironment("NSwag"))
            {
                using var scope = app.ApplicationServices.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                DataSeeder.Seed(context);
            }

            if (env.IsDevelopment())
            {
                app.UseOpenApi();
                app.UseSwaggerUi();
            }

            app.UseCors("AllowAngularApp");
            if(!env.IsDevelopment())
            {
                app.UseHttpsRedirection();
            }
                            
            
            app.UseAuthentication();
            
            app.UseRouting();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}