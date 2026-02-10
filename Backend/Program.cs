//using Backend.Data;
//using Backend.Extensions;
//using Backend.Services;
//using Backend.Services.Auth;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;

//var builder = WebApplication.CreateBuilder(args);

//// -------------------- SERVICES --------------------
//builder.Services.AddTransient<IProductsService, ProductsService>();
//builder.Services.AddTransient<IBasketService, BasketService>();
//builder.Services.AddScoped<IAuthService, AuthService>();

//builder.Services.AddDbContext<ApplicationDbContext>(options =>
//    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

//builder.Services.AddControllers();

//// Extensions
//builder.Services.AddIdentityServiceRules();

//var jwtSettings = builder.Configuration.GetSection("JwtSettings");
//builder.Services.AddAuthenticationServiceRules(jwtSettings);

//builder.Services.AddCorsServiceRules();

//builder.Services.AddOpenApiServiceRules();


//// -------------------- BUILD APP --------------------
//var app = builder.Build();

//// Seed DB (skip for NSwag)
//if (!app.Environment.IsEnvironment("NSwag"))
//{
//    using var scope = app.Services.CreateScope();
//    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
//    DataSeeder.Seed(context);
//}

//// Middleware
//if (app.Environment.IsDevelopment())
//{
//    app.UseOpenApi();
//    app.UseSwaggerUi();
//}

//app.UseHttpsRedirection();
//app.UseCors("AllowAngularApp");
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();

//// -------------------- RUN APP --------------------
//if (!app.Environment.IsEnvironment("NSwag"))
//{
//    app.Run();
//}


using Backend;
using Microsoft.AspNetCore.Hosting;

var builder = WebApplication.CreateBuilder(args);

// Use Startup.cs
builder.Host.ConfigureServices((context, services) =>
{
    var startup = new Startup(context.Configuration);
    startup.ConfigureServices(services);
});

var app = builder.Build();

// Configure middleware
var startupInstance = new Startup(app.Services.GetRequiredService<IConfiguration>());
startupInstance.Configure(app, app.Environment);

app.Run();