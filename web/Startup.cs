using JavaScriptViewEngine;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.IO;

namespace DotnetSpa
{
    public class Startup
    {
        IWebHostEnvironment _env;
        ILoggerFactory _loggerFactory;

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            _env = env;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddJsEngine(builder =>
            {
                builder.UseSingletonEngineFactory();

                builder.UseNodeRenderEngine(nodeOptions =>
                {
                    nodeOptions.ProjectDirectory = Path.Combine(_env.WebRootPath, "app");
                    nodeOptions.GetModuleName = (path, model, bag, values, area, type) => "server";
                   // nodeOptions.NodeInstanceOutputLogger = _loggerFactory.CreateLogger("NodeRenderEngine");
                });
            });

            services.AddControllersWithViews();
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
                app.UseExceptionHandler("/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseJsEngine();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints
                    .MapControllerRoute(
                        name: "default",
                        pattern: "{controller=Home}/{action=Index}/{id?}"
                    );

                endpoints
                    .MapControllerRoute(
                        name: "app",
                        pattern: "{*anything}",
                        defaults: new { controller = "Home", action = "Index" }
                    );
            });

            app.Use((context, next) => {
                context.Response.StatusCode = 404;
                return next();
            });
        }
    }
}
