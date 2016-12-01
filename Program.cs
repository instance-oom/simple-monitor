using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;

namespace Monitor
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder().AddEnvironmentVariables();
            var config = builder.Build();
            var port = config["MonitorListenPort"] ?? "80";
            var host = new WebHostBuilder()
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseUrls($"http://*:{port}")
                .Build();

            host.Run();
        }
    }
}
