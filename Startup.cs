using System.IO;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Monitor.Filters;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Monitor
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc(config =>
            {
                config.RespectBrowserAcceptHeader = true;
                //config.InputFormatters.Add(new XmlSerializerInputFormatter());
                //config.OutputFormatters.Add(new XmlSerializerOutputFormatter());
            }).AddJsonOptions(opt =>
            {
                opt.SerializerSettings.ContractResolver = new DefaultContractResolver();
                //opt.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                opt.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;                
            }).AddMvcOptions(opt =>
            {
                opt.Filters.Add(new GlobalExceptionFilter());
            });

            //var connection = Configuration["DBSetting:SqliteConnectionString"];
            //services.AddDbContext<MonitorContext>(options => options.UseSqlite(connection));

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsSample", p => p.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            loggerFactory.AddConsole(Configuration.GetSection("Logging"));
            loggerFactory.AddDebug();

            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404 && !Path.HasExtension(context.Request.Path.Value))
                {
                    context.Request.Path = "/";
                    context.Response.StatusCode = 200;
                    await next();
                }
            });

            app.UseCors("CorsSample");
            app.UseMvc();
            app.UseDefaultFiles();
            app.UseStaticFiles();
        }
    }
}
