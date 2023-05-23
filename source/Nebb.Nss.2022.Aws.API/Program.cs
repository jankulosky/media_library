using Nebb.Nss._2022.Aws.API.Configuration;
using Nebb.Nss._2022.Aws.API.Container;
using Nebb.Nss._2022.Aws.Service.Container;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.GetConfig();

builder.Services.AddCorsManagement(builder.Configuration);

// Add services to the container.
builder.Services.AddServiceManagers(builder.Configuration);
builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(NebbNssAwsExtension.AngularUiOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
