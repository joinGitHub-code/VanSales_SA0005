using DinkToPdf.Contracts;
using DinkToPdf;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VanSale.Models;
using System.IO;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace VanSales
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDistributedMemoryCache();//excel
            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30);
             
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            //Dinktopdf
            var context = new CustomAssemblyLoadContext();
context.LoadUnmanagedLibrary(Path.Combine(Directory.GetCurrentDirectory(), "libwkhtmltox.dll"));
            services.AddSingleton(typeof(IConverter), new SynchronizedConverter(new PdfTools()));
            services.AddControllers();
            services.AddControllersWithViews();
            object value = services.AddControllers().AddNewtonsoftJson(options =>
               options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
           );

            // Add authentication services
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(options =>
                {
                    options.Cookie.Name = "YourCookieName"; // Name of the authentication cookie
                    options.LoginPath = "/Main/Login";    // Path to the login page
                    options.LogoutPath = "/Main/Logout";  // Path to the logout page
                    options.AccessDeniedPath = "/Main/Logout";  // Path for access denied responses

                    // Sliding expiration means that the cookie will be renewed on each request
                    // If you want a fixed expiration time, set options.ExpireTimeSpan
                    options.SlidingExpiration = true;

                    // You can configure other options like Cookie.HttpOnly, Cookie.SecurePolicy, etc.
                    // For more advanced configurations, refer to the CookieAuthenticationOptions documentation.
                });

            services.AddAuthorization();



        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            app.UseStaticFiles();
            app.UseRouting();
            app.UseAuthentication();//for Identity User           
            app.UseAuthorization();
            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Main}/{action=Login}/{id?}");
            });
        }
    }
}
