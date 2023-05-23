namespace Nebb.Nss._2022.Aws.API.Configuration
{
    public static class AppConfigurationBuilder
    {
        internal static void GetConfig(this IConfigurationBuilder configurationManager)
        {
            configurationManager.SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();
        }
    }
}
