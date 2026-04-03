// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using backend.Data;
// using backend.Models;
// using backend.Services;
// using backend.Controllers;
// using Microsoft.AspNetCore.Http.Features;
// using Microsoft.Extensions.FileProviders;

// var builder = WebApplication.CreateBuilder(args);

// // Add services to the container.
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();


// // JWT Configuration
// var jwtSettings = builder.Configuration.GetSection("Jwt");
// var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

// builder.Services.AddAuthentication(options =>
// {
//     options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//     options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
// })
// .AddJwtBearer(options =>
// {
//     options.RequireHttpsMetadata = false;
//     options.SaveToken = true;
//     options.TokenValidationParameters = new TokenValidationParameters
//     {
//         ValidateIssuerSigningKey = true,
//         IssuerSigningKey = new SymmetricSecurityKey(key),
//         ValidateIssuer = true,
//         ValidIssuer = jwtSettings["Issuer"],
//         ValidateAudience = true,
//         ValidAudience = jwtSettings["Audience"],
//         ValidateLifetime = true,
//         ClockSkew = TimeSpan.Zero
//     };

//     // Important for SignalR/WebSockets
//     options.Events = new JwtBearerEvents
//     {
//         OnMessageReceived = context =>
//         {
//             var accessToken = context.Request.Query["access_token"];
//             var path = context.HttpContext.Request.Path;

//             if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
//             {
//                 context.Token = accessToken;
//             }

//             return Task.CompletedTask;
//         }
//     };
// });

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("ReactApp", policy =>
//     {
//         policy.WithOrigins(
//                 "http://localhost:5173",
//                 "http://localhost:5174",
//                 "http://localhost:3000"
//             )
//             .AllowAnyHeader()
//             .AllowAnyMethod()
//             .AllowCredentials();
//     });
// });

// // Configure PostgreSQL Database
// var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
// if (string.IsNullOrEmpty(connectionString))
// {
//     throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
// }

// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseNpgsql(connectionString));

// builder.Services.AddAuthorization();

// // Add Identity with custom AppUser
// builder.Services.AddIdentityApiEndpoints<AppUser>(options =>
// {
//     // Configure password requirements
//     options.Password.RequireDigit = false;
//     options.Password.RequireLowercase = false;
//     options.Password.RequireNonAlphanumeric = false;
//     options.Password.RequireUppercase = false;
//     options.Password.RequiredLength = 3;
// })
// .AddEntityFrameworkStores<ApplicationDbContext>();


// // Register services
// builder.Services.AddScoped<IJwtService, JwtService>();
// builder.Services.AddScoped<IUserService, UserService>();

// builder.Services.AddHttpContextAccessor();
// builder.Services.AddScoped<TrekPackageController>();

// builder.Services.Configure<FormOptions>(options =>
// {
//     options.ValueLengthLimit = int.MaxValue;
//     options.MultipartBodyLengthLimit = int.MaxValue;
//     options.MemoryBufferThreshold = int.MaxValue;
// });


// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// // IMPORTANT: Static files should come early in the pipeline
// // This serves files from wwwroot
// app.UseStaticFiles();

// // Optional: If you want to serve files from other directories
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(
//         Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")),
//     RequestPath = ""
// });

// // Add logging to see what files are being requested (for debugging)
// app.Use(async (context, next) =>
// {
//     if (context.Request.Path.StartsWithSegments("/uploads"))
//     {
//         Console.WriteLine($"📁 Static file requested: {context.Request.Path}");
//         var filePath = Path.Combine(app.Environment.WebRootPath,
//             context.Request.Path.Value.TrimStart('/'));
//         Console.WriteLine($"🔍 Looking for file at: {filePath}");
//         Console.WriteLine($"📂 File exists: {File.Exists(filePath)}");
//     }
//     await next();
// });

// app.UseHttpsRedirection();
// app.UseCors("ReactApp");
// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();

// // Seed admin user
// using (var scope = app.Services.CreateScope())
// {
//     var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

//     if (await userManager.FindByNameAsync("Admin") == null)
//     {
//         var admin = new AppUser
//         {
//             UserName = "Admin",
//             Name = "Administrator",
//             CreatedAt = DateTime.UtcNow,
//             IsActive = true
//         };

//         await userManager.CreateAsync(admin, "admin");
//         Console.WriteLine("✅ Admin user created: Admin/admin");
//     }
// }

// app.Run();

//--------------------------------------------------------end
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Data;
using backend.Models;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
    
    // CRITICAL: Add this to handle token from Authorization header correctly
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            
            // Check for token in Authorization header (this is the standard way)
            var authHeader = context.Request.Headers["Authorization"].FirstOrDefault();
            if (!string.IsNullOrEmpty(authHeader) && authHeader.StartsWith("Bearer "))
            {
                context.Token = authHeader.Substring("Bearer ".Length).Trim();
            }
            // Also check query string for SignalR/WebSockets if needed
            else if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs"))
            {
                context.Token = accessToken;
            }
            
            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine($"Challenge: {context.Error}, {context.ErrorDescription}");
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Configure Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// Configure Identity with Roles
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 3;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;

    // User settings
    options.User.RequireUniqueEmail = true;
    
    // Sign-in settings
    options.SignIn.RequireConfirmedAccount = false;
    options.SignIn.RequireConfirmedEmail = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// Register JWT Service
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<FormOptions>(options =>
{
    options.ValueLengthLimit = int.MaxValue;
    options.MultipartBodyLengthLimit = int.MaxValue;
    options.MemoryBufferThreshold = int.MaxValue;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseCors("ReactApp");
app.UseAuthentication(); // Make sure this is before UseAuthorization
app.UseAuthorization();

app.MapControllers();

// Seed Roles and Admin User
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    // Create roles
    string[] roleNames = { "Admin", "Customer" };
    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
            Console.WriteLine($"✅ Role '{roleName}' created");
        }
    }

    // Create admin user if not exists
    var adminEmail = "admin@example.com";
    var adminUser = await userManager.FindByEmailAsync(adminEmail);
    if (adminUser == null)
    {
        adminUser = new AppUser
        {
            UserName = adminEmail,
            Email = adminEmail,
            Name = "Administrator",
            UserType = "Admin",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var result = await userManager.CreateAsync(adminUser, "Admin@123");
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(adminUser, "Admin");
            Console.WriteLine("✅ Admin user created: admin@example.com / Admin@123");
        }
        else
        {
            Console.WriteLine($"❌ Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
        }
    }
}

app.Run();