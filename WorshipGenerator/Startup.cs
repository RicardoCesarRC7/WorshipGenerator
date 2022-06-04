using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using WorshipGenerator.Business.Management.Departments;
using WorshipGenerator.Business.Management.Membership;
using WorshipGenerator.Filters;
using WorshipGenerator.Models.Repositories.Department;
using WorshipGenerator.Models.Repositories.Membership;
using WorshipGenerator.Models.Repositories.Musica;
using WorshipGenerator.Models.Repositories.Programacao;

namespace WorshipGenerator
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
            services.AddControllersWithViews();

            services.AddMvc().AddSessionStateTempDataProvider();
            services.AddSession(options => 
            {
                options.IdleTimeout = TimeSpan.FromHours(1);
            });

            services.AddScoped<IProgramacaoRepository, ProgramacaoRepository>();
            services.AddScoped<IMusicaRepository, MusicaRepository>();
            services.AddScoped<IMembershipRepository, MembershipRepository>();
            services.AddScoped<IDepartmentRepository, DepartmentRepository>();

            services.AddScoped<IMembershipBusiness, MembershipBusiness>();
            services.AddScoped<IDepartmentBusiness, DepartmentBusiness>();
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
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSession();

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });

            var cultureInfo = new CultureInfo("pt-BR");
            //cultureInfo.NumberFormat.CurrencySymbol = "R$";

            CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
            CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;
        }
    }
}
