
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.HubConfig;
using GerenciaMusic360.Schedulers;
using GerenciaMusic360.Services.Implementations;
using GerenciaMusic360.Services.Implementations.Chat;
using GerenciaMusic360.Services.Implementations.Report;
using GerenciaMusic360.Services.Interfaces;
using GerenciaMusic360.Services.Interfaces.Chats;
using GerenciaMusic360.Services.Interfaces.Report;
using GerenciaMusic360.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Serialization;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GerenciaMusic360
{
    public class Startup
    {
        private const string SecretKey = "iNivDmHLpUA223sqsfhqGbMRdRj1PVkH";
        private readonly SymmetricSecurityKey _signingKey =
            new SymmetricSecurityKey(Encoding.ASCII.GetBytes(SecretKey));
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }
        static public List<Permission> allowedPermissions = new List<Permission>();
        public void ConfigureServices(IServiceCollection services)
        {

#if DEBUG
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    build =>
                    {
                        build
                            .AllowCredentials()
                            .AllowAnyHeader()
                            .SetIsOriginAllowedToAllowWildcardSubdomains()
                            .AllowAnyMethod()
                            .AllowAnyOrigin();
                    });
            });
#endif
#if RELEASE
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    build => build.WithOrigins("http://admin.gerenciamusic360.com/")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });
#endif
            services.AddResponseCompression();

            services.AddSignalR().AddJsonProtocol(options =>
            {
                options.PayloadSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            });

            services.AddMvc()
                .AddJsonOptions(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore) //ignores self reference object 
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_1); //validate api rules


            services.AddHttpContextAccessor();


            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "Gerencia Music 360", Version = "v1" });
            });

            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot/clientapp/dist";
            });

            services.Configure<IISOptions>(options =>
            {
                options.ForwardClientCertificate = false;
            });
#if DEBUG
            services.AddDbContext<Context_DB>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection"), b =>
            b.MigrationsAssembly("GerenciaMusic360.Data")));
#endif
#if RELEASE
            services.AddDbContext<Context_DB>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("Connection"), b =>
            b.MigrationsAssembly("GerenciaMusic360.Data")));
#endif
            string jwt = "";
#if DEBUG
            jwt = nameof(JWT);
#endif
#if RELEASE
            jwt = "JWTPROD";
#endif
            var jwtAppSettingOptions = Configuration.GetSection(jwt);
            services.Configure<JWT>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JWT.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JWT.Audience)];
                options.SigningCredentials = new SigningCredentials(_signingKey, SecurityAlgorithms.HmacSha256);
            });

            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtAppSettingOptions[nameof(JWT.Issuer)],

                ValidateAudience = true,
                ValidAudience = jwtAppSettingOptions[nameof(JWT.Audience)],

                ValidateIssuerSigningKey = true,
                IssuerSigningKey = _signingKey,

                RequireExpirationTime = false,
                ValidateLifetime = false,

                ClockSkew = TimeSpan.Zero
            };

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(configureOptions =>
            {
                configureOptions.ClaimsIssuer = jwtAppSettingOptions[nameof(JWT.Issuer)];
                configureOptions.TokenValidationParameters = tokenValidationParameters;
                configureOptions.SaveToken = true;
                configureOptions.IncludeErrorDetails = true;
            });

            var builder = services.AddIdentityCore<AspNetUsers>(config =>
            {
                config.Password.RequireDigit = false;
                config.Password.RequireLowercase = false;
                config.Password.RequireUppercase = false;
                config.Password.RequireNonAlphanumeric = false;
                config.Password.RequiredLength = 6;
            }).AddRoles<AspNetRoles>();

            builder = new IdentityBuilder(builder.UserType, typeof(AspNetRoles), builder.Services);
            builder.AddEntityFrameworkStores<Context_DB>().AddDefaultTokenProviders();

            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddTransient<IAccountService, AccountService>();
            services.AddTransient<IUserProfileService, UserProfileService>();
            services.AddTransient<IHelperService, HelperService>();
            services.AddTransient<IVisaTypeService, VisaTypeService>();
            services.AddTransient<ICountryService, CountryService>();
            services.AddTransient<IStateService, StateService>();
            services.AddTransient<ICityService, CityService>();
            services.AddTransient<IMusicalGenreService, MusicalGenreService>();
            services.AddTransient<IMembersGroupService, MembersGroupService>();
            services.AddTransient<IGroupService, GroupService>();
            services.AddTransient<IRoleProfileService, RoleProfileService>();
            services.AddTransient<ISponsorService, SponsorService>();
            services.AddTransient<IContactsSponsorService, ContactsSponsorService>();
            services.AddTransient<IWorkTypeService, WorkTypeService>();
            services.AddTransient<IAddressTypeService, AddressTypeService>();
            services.AddTransient<IAddressService, AddressService>();
            services.AddTransient<IPersonService, PersonService>();
            services.AddTransient<IMainActivityService, MainActivityService>();
            services.AddTransient<ISocialNetworkTypeService, SocialNetworkTypeService>();
            services.AddTransient<IPersonSocialNetworkService, PersonSocialNetworkService>();
            services.AddTransient<IMainActivityService, MainActivityService>();
            services.AddTransient<IPersonMusicalInstrumentService, PersonMusicalInstrumentService>();
            services.AddTransient<IPersonTypeService, PersonTypeService>();
            services.AddTransient<IPersonMusicalGenreService, PersonMusicalGenreService>();
            services.AddTransient<IMusicalInstrumentService, MusicalInstrumentService>();
            services.AddTransient<IPersonDocumentTypeService, PersonDocumentTypeService>();
            services.AddTransient<IPersonDocumentService, PersonDocumentService>();
            services.AddTransient<IArtistMemberService, ArtistMemberService>();
            services.AddTransient<IArtistAgentService, ArtistAgentService>();
            services.AddTransient<IGroupMemberService, GroupMemberService>();
            services.AddTransient<IPreferenceTypeService, PreferenceTypeService>();
            services.AddTransient<IPreferenceService, PreferenceService>();
            services.AddTransient<IPersonPreferenceService, PersonPreferenceService>();
            services.AddTransient<ITypeService, TypeService>();
            services.AddTransient<ITypeNameService, TypeNameService>();
            services.AddTransient<IWorkService, WorkService>();
            services.AddTransient<IPersonWorkService, PersonWorkService>();
            services.AddTransient<INotificationService, NotificationService>();
            services.AddTransient<IRoleNotificationService, RoleNotificationService>();
            services.AddTransient<IMailDispatcherService, MailDispatcherService>();
            services.AddTransient<IUserNotificationService, UserNotificationService>();
            services.AddTransient<IPersonAlbumService, PersonAlbumService>();
            services.AddTransient<IAlbumService, AlbumService>();
            services.AddTransient<IAlbumWorkService, AlbumWorkService>();
            services.AddTransient<IVideoService, VideoService>();
            services.AddTransient<IProjectTypeService, ProjectTypeService>();
            services.AddTransient<ICurrencyService, CurrencyService>();
            services.AddTransient<IProjectStateService, ProjectStateService>();
            services.AddTransient<IStatusProjectService, StatusProjectService>();
            services.AddTransient<ICalendarService, CalendarService>();
            services.AddTransient<IVideoComposerService, VideoComposerService>();
            services.AddTransient<ILocationService, LocationService>();
            services.AddTransient<IProjectContactService, ProjectContactService>();
            services.AddTransient<IProjectMemberService, ProjectMemberService>();
            services.AddTransient<IProjectService, ProjectService>();
            services.AddTransient<IProjectTaskService, ProjectTaskService>();
            services.AddTransient<ITemplateTaskDocumentDetailService, TemplateTaskDocumentDetailService>();
            services.AddTransient<IProjectTaskAutorizeService, ProjectTaskAutorizeService>();
            services.AddTransient<IDepartmentService, DepartmentService>();
            services.AddTransient<ICompanyService, CompanyService>();
            services.AddTransient<IProjectBuyerService, ProjectBuyerService>();
            services.AddTransient<IPersonProjectContactService, PersonProjectContactService>();
            services.AddTransient<IUserMemberProjectService, UserMemberProjectService>();
            services.AddTransient<IBuyerTypeService, BuyerTypeService>();
            services.AddTransient<IPasswordRecoverService, PasswordRecoverService>();
            services.AddTransient<IConfigurationImageService, ConfigurationImageService>();
            services.AddTransient<IConfigurationImageUserService, ConfigurationImageUserService>();
            services.AddTransient<IProjectWorkService, ProjectWorkService>();
            services.AddTransient<IProductionTypeService, ProductionTypeService>();
            services.AddTransient<IForeignWorkService, ForeignWorkService>();
            services.AddTransient<IForeignWorkPersonService, ForeignWorkPersonService>();
            services.AddTransient<IForeignWorkPersonService, ForeignWorkPersonService>();
            services.AddTransient<ICTaskAutorizeService, CTaskAutorizeService>();
            services.AddTransient<IMenuService, MenuService>();
            services.AddTransient<IModuleService, ModuleService>();
            services.AddTransient<ITimeService, TimeService>();
            services.AddTransient<ILocalCompanyService, LocalCompanyService>();
            services.AddTransient<IContractTypeService, ContractTypeService>();
            services.AddTransient<IConfigurationTaskService, ConfigurationTaskService>();
            services.AddTransient<ICertificationAuthorityService, CertificationAuthorityService>();
            services.AddTransient<IWorkCollaboratorService, WorkCollaboratorService>();
            services.AddTransient<IWorkRecordingService, WorkRecordingService>();
            services.AddTransient<ICategoryService, CategoryService>();
            services.AddTransient<IConfigurationProjectTOwnerService, ConfigurationProjectTOwnerService>();
            services.AddTransient<IFileService, FileService>();
            services.AddTransient<IContractService, ContractService>();
            services.AddTransient<IProjectBudgetService, ProjectBudgetService>();
            services.AddTransient<IProjectBudgetDetailService, ProjectBudgetDetailService>();
            services.AddTransient<IConfigurationPBCategoryService, ConfigurationPBCategoryService>();
            services.AddTransient<IMarketingService, MarketingService>();
            services.AddTransient<IConfigMarketingTemplateService, ConfigMarketingTemplateService>();
            services.AddTransient<IStartCenterOneService, StartCenterOneService>();
            services.AddTransient<IStartCenterTwoService, StartCenterTwoService>();
            services.AddTransient<IStartCenterThreeService, StartCenterThreeService>();
            services.AddTransient<ILanguageService, LanguageService>();
            services.AddTransient<IStatusModuleService, StatusModuleService>();
            services.AddTransient<IAssociationService, AssociationService>();
            services.AddTransient<IEditorService, EditorService>();
            services.AddTransient<IConfigurationLabelCopyService, ConfigurationLabelCopyService>();
            services.AddTransient<IProjectLabelCopyService, ProjectLabelCopyService>();
            services.AddTransient<IProjectTravelLogisticsService, ProjectTravelLogisticsService>();
            services.AddTransient<IPermissionService, PermissionService>();
            services.AddTransient<IRolProfilePermissionService, RolProfilePermissionService>();
            services.AddTransient<IRequestService, RequestService>();
            services.AddTransient<ILabelCopyHeaderService, LabelCopyHeaderService>();
            services.AddTransient<ILabelCopyDetailService, LabelCopyDetailService>();
            services.AddTransient<IActivityService, ActivityService>();
            services.AddTransient<IProjectTravelLogisticsFlightService, ProjectTravelLogisticsFlightService>();
            services.AddTransient<IProjectTravelLogisticsHotelService, ProjectTravelLogisticsHotelService>();
            services.AddTransient<IProjectTravelLogisticsTransportationService, ProjectTravelLogisticsTransportationService>();
            services.AddTransient<IProjectTravelLogisticsOtherService, ProjectTravelLogisticsOtherService>();
            services.AddTransient<IAirlineService, AirlineService>();
            services.AddTransient<IAutoBrandService, AutoBrandService>();
            services.AddTransient<IContractTermsService, ContractTermsService>();
            services.AddTransient<ITermTypeService, TermTypeService>();
            services.AddTransient<ITermsService, TermsService>();
            services.AddTransient<IFieldService, FieldService>();
            services.AddTransient<IFieldTypeService, FieldTypeService>();
            services.AddTransient<IFieldValueService, FieldValueService>();
            services.AddTransient<IMarketingDemographicService, MarketingDemographicService>();
            services.AddTransient<IMarketingPlanService, MarketingPlanService>();
            services.AddTransient<INotificationWebService, NotificationWebService>();
            services.AddTransient<IMessageService, MessageService>();
            services.AddTransient<IParticipantService, ParticipantService>();
            services.AddTransient<IMarketingPlanAutorizeService, MarketingPlanAutorizeService>();
            services.AddTransient<IContractMembersService, ContractMembersService>();
            services.AddTransient<IContractStatusService, ContractStatusService>();
            services.AddTransient<ITemplateContractDocumentService, TemplateContractDocumentService>();
            services.AddTransient<ITemplateBudgetService, TemplateBudgetService>();
            services.AddTransient<ITemplateBudgetEventService, TemplateBudgetEventService>();
            services.AddTransient<IProjectEventService, ProjectEventService>();
            services.AddTransient<IGoalService, GoalService>();
            services.AddTransient<IMarketingGoalService, MarketingGoalService>();
            services.AddTransient<IMarketingGoalsAuditedService, MarketingGoalsAuditedService>();
            services.AddTransient<IComposerDetailService, ComposerDetailService>();
            services.AddTransient<IProjectArtistService, ProjectArtistService>();
            services.AddTransient<IPlayListService, PlayListService>();
            services.AddTransient<ICMarketingOverviewSectionService, CMarketingOverviewSectionService>();
            services.AddTransient<IMarketingOverviewService, MarketingOverviewService>();
            services.AddTransient<IMarketingOverviewDService, MarketingOverviewDService>();
            services.AddTransient<IConfigurationProjectTaskContractService, ConfigurationProjectTaskContractService>();
            services.AddTransient<IProjectWorkAdminService, ProjectWorkAdminService>();
            services.AddTransient<IEventService, EventService>();
            services.AddTransient<IKeyIdeasTypeService, KeyIdeasTypeService>();
            services.AddTransient<IMarketingKeyIdeasService, MarketingKeyIdeasService>();
            services.AddTransient<IMarketingKeyIdeasBudgetService, MarketingKeyIdeasBudgetService>();
            services.AddTransient<ICMKeyIdeasCategoryService, CMKeyIdeasCategoryService>();
            services.AddTransient<IMarketingAssetService, MarketingAssetService>();
            services.AddTransient<IMediaService, MediaService>();
            services.AddTransient<IPublisherService, PublisherService>();
            services.AddTransient<IKeyIdeaService, KeyIdeaService>();
            services.AddTransient<IMarketingKeyIdeasNamesService, MarketingKeyIdeasNamesService>();
            services.AddTransient<IMarketingPlanHeaderService, MarketingPlanHeaderService>();
            services.AddTransient<IMarketingCalendarService, MarketingCalendarService>();
            services.AddTransient<IContractTermTypeService, ContractTermTypeService>();
            services.AddTransient<ITrackService, TrackService>();
            services.AddTransient<ITrackWorkService, TrackWorkService>();
            services.AddTransient<IActivitiesProjectReports, ActivitiesProjectReportsService>();
            services.AddTransient<IMarketingActivitiesReport, MarketingActivitiesReportService>();
            services.AddTransient<IWorkPublisherService, WorkPublisherService>();
            services.AddTransient<IControlledListService, ControlledListService>();
            services.AddTransient<IReportMarketingService, ReportMarketingService>();
            services.AddTransient<IChecklistService, ChecklistService>();
            services.AddTransient<ICommentsService, CommentsService>();
            services.AddTransient<IMetasService, MetasService>();
            services.AddTransient<IMetasCommentsService, MetasCommentsService>();
            services.AddTransient<IDayliReportService, DayliReportService>();
            //services.AddMvc(config =>
            //{
            //    config.Filters.Add(new ActionFilter());
            //    });

            services.AddHostedService<QuartzHostedService>();
            services.AddSingleton<IJobFactory, SingletonJobFactory>();
            services.AddSingleton<ISchedulerFactory, StdSchedulerFactory>();
            // Add our job
            services.AddSingleton<TasksReminder>();
            services.AddSingleton(new JobSchedule(
                jobType: typeof(TasksReminder),
                cronExpression: "0 0/5 * * * ?"));

        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseResponseCompression();

            // Enable middleware to serve generated Swagger as a JSON endpoint.
            app.UseSwagger();

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), 
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            //app.UseCors("CorsPolicy");
            app.UseCors("CorsPolicy");


            app.UseAuthentication();

            app.UseSignalR(routes =>
            {
                routes.MapHub<NotificationHub>("/notificationHub");
                routes.MapHub<GroupChatHub>("/api/groupchat");
            });

            app.UseMvc();
            app.UseStaticFiles();

            app.UseCookiePolicy();

            app.UseSpaStaticFiles();
            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                    //spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
                }
            });
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<Context_DB>();
                var permissionService = new PermissionService(context);
                allowedPermissions = permissionService.GetAll().Where(p => p.IsRequired == false).ToList();
            }
        }

        private async Task<IScheduler> GetScheduler()
        {
            var properties = new NameValueCollection
            {
                { "quartz.scheduler.instanceName", "QuartzWithCore" },
                { "quartz.jobStore.type", "Quartz.Simpl.RAMJobStore, Quartz" },
            };
            var schedulerFactory = new StdSchedulerFactory(properties);
            var scheduler = await schedulerFactory.GetScheduler();
            await scheduler.Start();

            IJobDetail job = JobBuilder.Create<TasksReminder>().Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity($"Tasks Reminder-{DateTime.Now}")
                //.WithCronSchedule("0 0 9 ? * WED")
                .WithCronSchedule("0 * ? ? * ?")
                .WithPriority(1)
                .Build();

            await scheduler.ScheduleJob(job, trigger);

            return scheduler;
        }

    }
}
