using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Nebb.Nss._2022.Aws.API.Helpers;
using Nebb.Nss._2022.Aws.Model.Entities;
using System;

namespace Nebb.Nss._2022.Aws.API.Container
{
    public static class NebbNssAwsExtension
    {
        public const string AngularUiOrigins = "_AngularUiOrigins";

        public static IServiceCollection AddCorsManagement(this IServiceCollection serviceCollection, IConfiguration configuration)
        {
            serviceCollection.AddCors(options =>
            {
                options.AddPolicy(name: AngularUiOrigins, builder =>
                {
                    var corsDomain = configuration.GetValue<string>("Cors");
                    builder.WithOrigins("http://localhost:4200", "http://localhost", corsDomain)
                    .WithMethods("GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS")
                    .AllowAnyHeader()
                    .AllowCredentials();
                });
            });
            serviceCollection.Configure<IISServerOptions>(options =>
            {
                options.MaxRequestBodySize = int.MaxValue;
            });
            serviceCollection.Configure<KestrelServerOptions>(options =>
            {
                options.Limits.MaxRequestBodySize = int.MaxValue;
            });
            serviceCollection.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = int.MaxValue;
                x.MultipartHeadersLengthLimit = int.MaxValue;
            });
            serviceCollection.AddScoped<IValidator<IFormFile>, MediaFilesValidator>();

            return serviceCollection;
        }

    }
}
