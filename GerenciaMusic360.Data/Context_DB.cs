using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Entities.Models.Chats;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GerenciaMusic360.Data
{
    public class Context_DB : IdentityDbContext<IdentityUser, IdentityRole, string>
    {
        public Context_DB(DbContextOptions<Context_DB> options)
            : base(options)
        {

        }

        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<UserProfile> UserProfile { get; set; }
        public virtual DbSet<Country> Country { get; set; }
        public virtual DbSet<MusicalGenre> MusicalGenre { get; set; }
        public virtual DbSet<VisaType> VisaType { get; set; }
        public virtual DbSet<State> State { get; set; }
        public virtual DbSet<City> City { get; set; }
        public virtual DbSet<MembersGroup> MembersGroup { get; set; }
        public virtual DbSet<Group> Group { get; set; }
        public virtual DbSet<RoleProfile> RoleProfile { get; set; }
        public virtual DbSet<Sponsor> Sponsor { get; set; }
        public virtual DbSet<ContactsSponsor> ContactsSponsor { get; set; }
        public virtual DbSet<WorkType> WorkType { get; set; }
        public virtual DbSet<AddressType> AddressType { get; set; }
        public virtual DbSet<Address> Address { get; set; }
        public virtual DbSet<Person> Person { get; set; }
        public virtual DbSet<MainActivity> MainActivity { get; set; }
        public virtual DbSet<MusicalInstrument> MusicalInstrument { get; set; }
        public virtual DbSet<SocialNetworkType> SocialNetworkType { get; set; }
        public virtual DbSet<PersonSocialNetwork> PersonSocialNetwork { get; set; }
        public virtual DbSet<PersonMusicalInstrument> PersonMusicalInstrument { get; set; }
        public virtual DbSet<PersonType> PersonType { get; set; }
        public virtual DbSet<PersonMusicalGenre> PersonMusicalGenre { get; set; }
        public virtual DbSet<PersonDocumentType> PersonDocumentType { get; set; }
        public virtual DbSet<PersonDocument> PersonDocument { get; set; }
        public virtual DbSet<ArtistMember> ArtistMember { get; set; }
        public virtual DbSet<ArtistAgent> ArtistAgent { get; set; }
        public virtual DbSet<GroupMember> GroupMember { get; set; }
        public virtual DbSet<PreferenceType> PreferenceType { get; set; }
        public virtual DbSet<Preference> Preference { get; set; }
        public virtual DbSet<PersonPreference> PersonPreference { get; set; }
        public virtual DbSet<TypeName> TypeName { get; set; }
        public virtual DbSet<Work> Work { get; set; }
        public virtual DbSet<PersonWork> PersonWork { get; set; }
        public virtual DbSet<RoleProfileNotification> RoleProfileNotification { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<MailDispatcher> MailDispatcher { get; set; }
        public virtual DbSet<Album> Album { get; set; }
        public virtual DbSet<PersonAlbum> PersonAlbum { get; set; }
        public virtual DbSet<AlbumWork> AlbumWork { get; set; }
        public virtual DbSet<Video> Video { get; set; }
        public virtual DbSet<VideoComposer> VideoComposer { get; set; }
        public virtual DbSet<ProjectType> ProjectType { get; set; }
        public virtual DbSet<Currency> Currency { get; set; }
        public virtual DbSet<ProjectState> ProjectState { get; set; }
        public virtual DbSet<StatusProject> StatusProject { get; set; }
        public virtual DbSet<Calendar> Calendar { get; set; }
        public virtual DbSet<Location> Location { get; set; }
        public virtual DbSet<Project> Project { get; set; }
        public virtual DbSet<CalendarDetails> CalendarDetails { get; set; }
        public virtual DbSet<ConfigurationTask> ConfigurationTask { get; set; }
        public virtual DbSet<ProjectTask> ProjectTask { get; set; }
        public virtual DbSet<TemplateTaskDocument> TemplateTaskDocument { get; set; }
        public virtual DbSet<TemplateTaskDocumentDetail> TemplateTaskDocumentDetail { get; set; }
        public virtual DbSet<ProjectContact> ProjectContact { get; set; }
        public virtual DbSet<ProjectMember> ProjectMember { get; set; }
        public virtual DbSet<ConfigurationTaskAutorize> ConfigurationTaskAutorize { get; set; }
        public virtual DbSet<ProjectTaskAutorize> ProjectTaskAutorize { get; set; }
        public virtual DbSet<Department> Department { get; set; }
        public virtual DbSet<Company> Company { get; set; }
        public virtual DbSet<ProjectBuyer> ProjectBuyer { get; set; }
        public virtual DbSet<BuyerType> BuyerType { get; set; }
        public virtual DbSet<ConfigurationImage> ConfigurationImage { get; set; }
        public virtual DbSet<ConfigurationImageUser> ConfigurationImageUser { get; set; }
        public virtual DbSet<PasswordRecover> PasswordRecover { get; set; }
        public virtual DbSet<ProjectWork> ProjectWork { get; set; }
        public virtual DbSet<ForeignWork> ForeignWork { get; set; }
        public virtual DbSet<ForeignWorkPerson> ForeignWorkPerson { get; set; }
        public virtual DbSet<ProductionType> ProductionType { get; set; }
        public virtual DbSet<Menu> Menu { get; set; }
        public virtual DbSet<TimeType> TimeType { get; set; }
        public virtual DbSet<Module> Module { get; set; }
        public virtual DbSet<Time> Time { get; set; }
        public virtual DbSet<LocalCompany> LocalCompany { get; set; }
        public virtual DbSet<Language> Language { get; set; }
        public virtual DbSet<ContractType> ContractType { get; set; }
        public virtual DbSet<CertificationAuthority> CertificationAuthority { get; set; }
        public virtual DbSet<WorkCollaborator> WorkCollaborator { get; set; }
        public virtual DbSet<WorkRecording> WorkRecording { get; set; }
        public virtual DbSet<Category> Category { get; set; }
        public virtual DbSet<ConfigurationProjectTypeOwner> ConfigurationProjectTypeOwner { get; set; }
        public virtual DbSet<Files> Files { get; set; }
        public virtual DbSet<Contract> Contract { get; set; }
        public virtual DbSet<ProjectBudget> ProjectBudget { get; set; }
        public virtual DbSet<ProjectBudgetDetail> ProjectBudgetDetail { get; set; }
        public virtual DbSet<ConfigurationProjectBudgetCategory> ConfigurationProjectBudgetCategory { get; set; }
        public virtual DbSet<Marketing> Marketing { get; set; }
        public virtual DbSet<ConfigurationMarketingTemplate> ConfigurationMarketingTemplate { get; set; }
        public virtual DbSet<Association> Association { get; set; }
        public virtual DbSet<Editor> Editor { get; set; }
        public virtual DbSet<StatusModule> StatusModule { get; set; }
        public virtual DbSet<ConfigurationLabelCopy> ConfigurationLabelCopy { get; set; }
        public virtual DbSet<ProjectLabelCopy> ProjectLabelCopy { get; set; }
        public virtual DbSet<ProjectTravelLogistics> ProjectTravelLogistics { get; set; }
        public virtual DbSet<ProjectTravelLogisticsFlight> ProjectTravelLogisticsFlight { get; set; }
        public virtual DbSet<ProjectTravelLogisticsHotel> ProjectTravelLogisticsHotel { get; set; }
        public virtual DbSet<ProjectTravelLogisticsOther> ProjectTravelLogisticsOther { get; set; }
        public virtual DbSet<ProjectTravelLogisticsTransportation> ProjectTravelLogisticsTransportation { get; set; }
        public virtual DbSet<Request> Request { get; set; }
        public virtual DbSet<Permission> Permission { get; set; }
        public virtual DbSet<PermissionUserProfile> PermissionUserProfile { get; set; }
        public virtual DbSet<ContractTerms> ContractTerms { get; set; }
        public virtual DbSet<Terms> Terms { get; set; }
        public virtual DbSet<TermType> TermType { get; set; }
        public virtual DbSet<Field> Field { get; set; }
        public virtual DbSet<FieldType> FieldType { get; set; }
        public virtual DbSet<FieldValue> FieldValue { get; set; }
        public virtual DbSet<MarketingDemographic> MarketingDemographic { get; set; }
        public virtual DbSet<MarketingPlan> MarketingPlan { get; set; }
        public virtual DbSet<NotificationWeb> NotificationWeb { get; set; }
        public virtual DbSet<MessageViewModel> ChatMessage { get; set; }
        public virtual DbSet<MarketingPlanAutorize> MarketingPlanAutorize { get; set; }
        public virtual DbSet<ContractMembers> ContractMembers { get; set; }
        public virtual DbSet<ContractStatus> ContractStatus { get; set; }
        public virtual DbSet<TemplateContractDocument> TemplateContractDocument { get; set; }
        public virtual DbSet<ProjectEvent> ProjectEvent { get; set; }
        public virtual DbSet<Goal> Goal { get; set; }
        public virtual DbSet<MarketingGoals> MarketingGoals { get; set; }
        public virtual DbSet<MarketingGoalsAudited> MarketingGoalsAudited { get; set; }
        public virtual DbSet<ComposerDetail> ComposerDetail { get; set; }
        public virtual DbSet<ProjectArtist> ProjectArtist { get; set; }
        public virtual DbSet<PlayList> PlayList { get; set; }
        public virtual DbSet<MarketingOverview> MarketingOverview { get; set; }
        public virtual DbSet<MarketingOverViewDetail> MarketingOverViewDetail { get; set; }
        public virtual DbSet<ConfigurationMarketingOverviewSection> ConfigurationMarketingOverviewSection { get; set; }
        public virtual DbSet<Media> Media { get; set; }
        public virtual DbSet<ConfigurationProjectTaskContract> ConfigurationProjectTaskContract { get; set; }
        public virtual DbSet<ProjectWorkAdmin> ProjectWorkAdmin { get; set; }
        public virtual DbSet<KeyIdeasType> KeyIdeasType { get; set; }
        public virtual DbSet<MarketingKeyIdeas> MarketingKeyIdeas { get; set; }
        public virtual DbSet<MarketingKeyIdeasBudget> MarketingKeyIdeasBudget { get; set; }
        public virtual DbSet<ConfigurationMarketingKeyIdeasCategory> ConfigurationMarketingKeyIdeasCategory { get; set; }
        public virtual DbSet<MarketingAsset> MarketingAsset { get; set; }
        public virtual DbSet<KeyIdeas> KeyIdeas { get; set; }
        public virtual DbSet<MarketingKeyIdeasNames> MarketingKeyIdeasNames { get; set; }
        public virtual DbSet<MarketingCalendar> MarketingCalendar { get; set; }
        public virtual DbSet<ContractTermType> ContractTermType { get; set; }
        public virtual DbSet<Track> Track{ get; set; }
        public virtual DbSet<TrackWork> TrackWork { get; set; }
        public virtual DbSet<Publisher> Publisher { get; set; }
        public virtual DbSet<WorkPublisher> WorkPublisher { get; set; }
        public virtual DbSet<Checklist> Checklist { get; set; }
        public virtual DbSet<Comments> Comments { get; set; }
        public virtual DbSet<Metas> Metas { get; set; }
        public virtual DbSet<MetasComments> MetasComments { get; set; }
        public virtual DbSet<DayliReport> DayliReport { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<UserProfile>(entity =>
            {
                entity.Property(e => e.Brithdate).HasColumnType("date");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Gender).HasMaxLength(1);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.PhoneOne).HasMaxLength(32);

                entity.Property(e => e.PhoneTwo).HasMaxLength(32);

                entity.Property(e => e.PictureUrl).HasColumnName("PictureURL");

                entity.Property(e => e.SecondLastName).HasMaxLength(512);

                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Ignore(e => e.Email);

                entity.Ignore(e => e.RoleId);

                entity.Ignore(e => e.Role);
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Key)
                    .IsRequired()
                    .HasMaxLength(4);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);
            });

            modelBuilder.Entity<MusicalGenre>(entity =>
            {
                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VisaType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(128);
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Key).HasMaxLength(5);

                entity.Property(e => e.Name).HasMaxLength(512)
                   .IsRequired();

            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Key).HasMaxLength(5);

                entity.Property(e => e.Name).HasMaxLength(512)
                   .IsRequired();
            });

            modelBuilder.Entity<Group>(entity =>
            {
                entity.Property(e => e.Biography).IsUnicode(false);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creater)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<RoleProfile>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(4000);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.RoleId)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Ignore(e => e.Name);
            });

            modelBuilder.Entity<ContactsSponsor>(entity =>
            {
                entity.Property(e => e.BirthDate).HasColumnType("date");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.ExteriorNumber).HasMaxLength(10);

                entity.Property(e => e.Gender)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(e => e.InteriorNumber).HasMaxLength(10);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Municipality).HasMaxLength(150);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Neighborhood).HasMaxLength(200);

                entity.Property(e => e.PhoneOne).HasMaxLength(32);

                entity.Property(e => e.PhoneTwo).HasMaxLength(32);

                entity.Property(e => e.PictureUrl).HasColumnName("PictureURL");

                entity.Property(e => e.PostalCode).HasMaxLength(10);

                entity.Property(e => e.Reference).HasMaxLength(512);

                entity.Property(e => e.SecondLastName).HasMaxLength(512);

                entity.Property(e => e.Street).HasMaxLength(200);

                entity.Ignore(e => e.BirthDateString);
            });

            modelBuilder.Entity<Sponsor>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description)
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.OfficePhone)
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(150)
                    .IsUnicode(false);

                entity.Property(e => e.WebSite)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<WorkType>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(512);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(127);
            });

            modelBuilder.Entity<AddressType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Description).HasMaxLength(1024);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<Address>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.ExteriorNumber).HasMaxLength(10);

                entity.Property(e => e.InteriorNumber).HasMaxLength(10);

                entity.Property(e => e.Latitude).HasMaxLength(100);

                entity.Property(e => e.Longitude).HasMaxLength(100);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Municipality).HasMaxLength(150);

                entity.Property(e => e.Neighborhood).HasMaxLength(200);

                entity.Property(e => e.PostalCode).HasMaxLength(10);

                entity.Property(e => e.Reference).HasMaxLength(512);

                entity.Property(e => e.Street).HasMaxLength(200);

                entity.Ignore(e => e.CountryName);

                entity.Ignore(e => e.StateName);

                entity.Ignore(e => e.CityName);
            });

            modelBuilder.Entity<Person>(entity =>
            {
                entity.Property(e => e.AliasName).HasMaxLength(150);

                entity.Property(e => e.BirthDate).HasColumnType("date");

                entity.Property(e => e.CellPhone)
                    .HasMaxLength(18);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Gender)
                    .HasMaxLength(1);

                entity.Property(e => e.LastName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.OfficePhone)
                    .HasMaxLength(18);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

                entity.Property(e => e.Price).HasColumnType("decimal(12, 2)");

                entity.Property(e => e.SecondLastName).HasMaxLength(50);

                entity.Ignore(e => e.BirthDateString);

                entity.Ignore(e => e.StartDateJoinedString);

                entity.Ignore(e => e.EndDateJoinedString);

                entity.Ignore(e => e.PersonRelationId);

                entity.Ignore(e => e.MainActivityId);

                entity.Ignore(e => e.ProjectId);

                entity.Ignore(e => e.TypeId);
            });

            modelBuilder.Entity<MainActivity>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(150);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<MusicalInstrument>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creater)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PictureUrl).HasColumnName("PictureURL");
            });

            modelBuilder.Entity<SocialNetworkType>(entity =>
            {
                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Description).HasMaxLength(1024);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<PersonSocialNetwork>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Link)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.Name);

                entity.Ignore(e => e.Description);
            });

            modelBuilder.Entity<PersonMusicalInstrument>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<PersonType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(256);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<PersonMusicalGenre>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<PersonDocumentType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<PersonDocument>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.EmisionDate).HasColumnType("date");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.ExpiredDate).HasColumnType("date");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Number).HasMaxLength(25);

                entity.Ignore(e => e.ExpiredDateString);

                entity.Ignore(e => e.EmisionDateString);
            });

            modelBuilder.Entity<ArtistMember>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.EndDateJoined).HasColumnType("date");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.StartDateJoined).HasColumnType("date");
            });

            modelBuilder.Entity<ArtistAgent>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<GroupMember>(entity =>
            {

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.EndDateJoined).HasColumnType("datetime");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.StartDateJoined).HasColumnType("datetime");
            });

            modelBuilder.Entity<PreferenceType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(1024);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);
            });

            modelBuilder.Entity<Preference>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(2000);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

            });

            modelBuilder.Entity<PersonPreference>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.PreferenceTypeId);

                entity.Ignore(e => e.Name);

                entity.Ignore(e => e.Description);

                entity.Ignore(e => e.PictureURL);

                entity.Ignore(e => e.PreferenceTypeName);

            });

            modelBuilder.Entity<TypeName>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(128);
            });

            modelBuilder.Entity<Work>(entity =>
            {
                entity.Property(e => e.AmountRevenue).HasColumnType("decimal(8, 2)");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.CreatedDate).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(512);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.LicenseNum).HasMaxLength(50);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(127);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

                entity.Property(e => e.Rating).HasColumnType("decimal(4, 1)");

                entity.Property(e => e.RegisterDate).HasColumnType("datetime");

                entity.Property(e => e.RegisterNum).HasMaxLength(50);

                entity.Property(e => e.StatusId).HasDefaultValueSql("((4))");

                entity.Ignore(e => e.CreatedDateString);

                entity.Ignore(e => e.RegisterDateString);

                entity.Ignore(e => e.PersonRelationId);
            });

            modelBuilder.Entity<PersonWork>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);


            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Subject).HasMaxLength(512);

            });

            modelBuilder.Entity<RoleProfileNotification>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.RoleName);

                entity.Ignore(e => e.NotificationName);
            });

            modelBuilder.Entity<MailDispatcher>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.Subject).HasMaxLength(512);
            });

            modelBuilder.Entity<Album>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.NumRecord).HasMaxLength(150);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

                entity.Property(e => e.ReleaseDate).HasColumnType("date");

                entity.Ignore(e => e.PersonRelationId);

                entity.Ignore(e => e.ReleaseDateString);

                entity.Ignore(e => e.PersonRelationName);
            });

            modelBuilder.Entity<PersonAlbum>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);
            });

            modelBuilder.Entity<AlbumWork>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);
            });

            modelBuilder.Entity<Video>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.VideoUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Ignore(e => e.VideoTypeName);
            });

            modelBuilder.Entity<Calendar>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Location).HasMaxLength(350);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Notes).HasMaxLength(450);

                entity.Property(e => e.PictureUrl)
                    .HasColumnName("PictureURL")
                    .HasMaxLength(250);

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");

                entity.Ignore(e => e.StartDateString);

                entity.Ignore(e => e.EndDateString);
            });

            modelBuilder.Entity<ProjectType>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Currency>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(5)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(s => s.Country);

            });

            modelBuilder.Entity<ProjectState>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Notes)
                    .HasMaxLength(450)
                    .IsUnicode(false);

                //entity.Ignore(e => e.ProjectId);
                //entity.HasOne(s => s.StatusProject);
                //entity.HasOne(s => s.UserProfile);
            });

            modelBuilder.Entity<StatusProject>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Location>(entity =>
         {
             entity.Property(e => e.Created).HasColumnType("datetime");

             entity.Property(e => e.Creator)
                 .IsRequired()
                 .HasMaxLength(450);

             entity.Property(e => e.Erased).HasColumnType("datetime");

             entity.Property(e => e.Eraser).HasMaxLength(450);

             entity.Property(e => e.Modified).HasColumnType("datetime");

             entity.Property(e => e.Modifier).HasMaxLength(450);

             entity.Property(e => e.Capacity)
                 .IsRequired();

             entity.Property(e => e.WebSite)
                 .IsRequired()
                 .HasMaxLength(250)
                 .IsUnicode(false);

             entity.Property(e => e.PictureUrl)
                 .IsRequired()
                 .HasMaxLength(250)
                 .IsUnicode(false);

             entity.HasOne(s => s.Address);

         });

            modelBuilder.Entity<ProjectContact>(entity =>
            {

            });

            modelBuilder.Entity<ProjectMember>(entity =>
            {

            });

            modelBuilder.Entity<Project>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                //entity.Property(e => e.Capacity)
                //    .IsRequired();

                //entity.Property(e => e.WebSite)
                //    .IsRequired()
                //    .HasMaxLength(250)
                //    .IsUnicode(false);

                //entity.Property(e => e.PictureUrl)
                //    .IsRequired()
                //    .HasMaxLength(250)
                //    .IsUnicode(false);

                //entity.HasMany(s => s.ProjectStates);
                //entity.HasOne(s => s.ProjectType);

                entity.Ignore(e => e.StatusProjectId);

                entity.Ignore(e => e.StatusProjectName);

                entity.Ignore(e => e.CurrencyCode);

                entity.Ignore(e => e.CurrencyDescription);

                entity.Ignore(e => e.ProjectTypeName);

                entity.Ignore(e => e.LocationName);

                entity.Ignore(e => e.ArtistName);

                entity.Ignore(e => e.Spent);
            });

            modelBuilder.Entity<CalendarDetails>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.CreateDate).HasColumnType("datetime");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ConfigurationTask>(entity =>
            {
                entity.Ignore(e => e.TaskDocumentId);
            });

            modelBuilder.Entity<TemplateTaskDocument>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<TemplateTaskDocumentDetail>(entity =>
            {

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Ignore(e => e.UsersAuthorize);

                entity.Ignore(e => e.TemplateTaskDocumentName);

                entity.Ignore(e => e.EstimatedDateVerficationString);

                entity.Ignore(e => e.Required);

                entity.Ignore(e => e.IsPermanent);

                entity.Ignore(e => e.ProjectId);

                entity.Ignore(e => e.EntityId);
            });

            modelBuilder.Entity<ProjectTask>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.EstimatedDateVerfication).HasColumnType("datetime");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Notes).HasMaxLength(450);

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Ignore(e => e.EstimatedDateVerficationString);

                entity.Ignore(e => e.TemplateTaskDocumentId);

                entity.Ignore(e => e.TemplateTaskDocumentName);

                entity.Ignore(e => e.TemplateTaskDocumentDetailName);

                //entity.Ignore(e => e.Position);

                entity.Ignore(e => e.UserProfileId);

                entity.Ignore(e => e.UserProfileName);

                entity.Ignore(e => e.ConfigurationTaskId);

                entity.Ignore(e => e.Users);

                entity.Ignore(e => e.UserProfileAuthorized);

                entity.Ignore(e => e.DepartmentId);

                entity.Ignore(e => e.DepartmentName);

                entity.Ignore(e => e.hasContractPending);

                entity.Ignore(e => e.CalendarNotes);
                entity.Ignore(e => e.ProjectName);

            });

            modelBuilder.Entity<ConfigurationTaskAutorize>(entity =>
            {
                entity.Ignore(e => e.UserProfileName);

                entity.Ignore(e => e.UserProfileAuthorized);

                entity.Ignore(e => e.DepartmentId);

                entity.Ignore(e => e.DepartmentName);
            });

            modelBuilder.Entity<ProjectTaskAutorize>(entity =>
            {
                entity.Property(e => e.Notes)
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.VerificationDate).HasColumnType("datetime");

                entity.Ignore(e => e.UserProfileName);

                entity.Ignore(e => e.PictureUrl);
            });

            //modelBuilder.Entity<Department>(entity =>
            //{
            //    entity.Property(e => e.Created).HasColumnType("datetime");

            //    entity.Property(e => e.Creator)
            //        .IsRequired()
            //        .HasMaxLength(450);

            //    entity.Property(e => e.Erased).HasColumnType("datetime");

            //    entity.Property(e => e.Eraser).HasMaxLength(450);

            //    entity.Property(e => e.Modified).HasColumnType("datetime");

            //    entity.Property(e => e.Modifier).HasMaxLength(450);

            //    entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            //});
            modelBuilder.Entity<Department>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator).HasMaxLength(450);

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(150)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Company>(entity =>
            {

                entity.Property(e => e.BusinessName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.BusinessShortName)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator).HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.LegalName)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.TaxId)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ProjectBuyer>(entity =>
            {
                //entity.Property(e => e.Id).ValueGeneratedNever();
            });

            modelBuilder.Entity<ConfigurationImage>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                   .IsRequired()
                   .HasMaxLength(250);
            });

            modelBuilder.Entity<PasswordRecover>(entity =>
            {
                entity.Property(e => e.Code)
                    .IsRequired()
                    .HasMaxLength(512);

                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasMaxLength(256);

                entity.Property(e => e.ExpiredDate).HasColumnType("datetime");

                entity.Property(e => e.RecoverDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<ForeignWork>(entity =>
            {
                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(256);
            });

            modelBuilder.Entity<ForeignWorkPerson>(entity =>
            {
                entity.HasOne(d => d.ForeignWork)
                    .WithMany(p => p.ForeignWorkPerson)
                    .HasForeignKey(d => d.ForeignWorkId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ForeignWork");
            });

            modelBuilder.Entity<ProjectWork>(entity =>
            {
                entity.Ignore(e => e.ProductionTypeName);
            });

            modelBuilder.Entity<ProductionType>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Active)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .ValueGeneratedNever();

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Icon)
                    .HasColumnName("icon")
                    .HasMaxLength(50);

                entity.Property(e => e.MenuOrder).HasColumnName("menuOrder");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Roles).HasMaxLength(100);

                entity.Property(e => e.ParentId).HasColumnName("parentId");

                entity.Property(e => e.Self)
                    .HasColumnName("self")
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Title)
                    .IsRequired()
                    .HasColumnName("title")
                    .HasMaxLength(50);

                entity.Property(e => e.Translate)
                    .IsRequired()
                    .HasColumnName("translate")
                    .HasMaxLength(20);

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasMaxLength(20);

                entity.Property(e => e.Url)
                    .HasColumnName("url")
                    .HasMaxLength(150);
            });

            modelBuilder.Entity<TimeType>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Module>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(40)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Time>(entity =>
            {
                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");

                entity.Ignore(e => e.TimeTypeName);

            });

            modelBuilder.Entity<LocalCompany>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Language>(entity =>
            {
                entity.Property(e => e.Culture)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<ContractType>(entity =>
            {
                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.LocalCompanyId).HasDefaultValueSql("((1))");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");

                entity.Ignore(e => e.LocalCompanyName);
            });

            modelBuilder.Entity<CertificationAuthority>(entity =>
            {

                entity.Property(e => e.BusinessName)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.Property(e => e.Contact)
                    .IsRequired()
                    .HasMaxLength(250);

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .HasMaxLength(100);

                entity.Property(e => e.Phone)
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<WorkCollaborator>(entity =>
            {
                entity.Property(e => e.AmountRevenue).HasColumnType("decimal(10, 2)");

                entity.Property(e => e.PercentageRevenue).HasColumnType("decimal(10, 2)");

                entity.HasOne(d => d.Composer)
                   .WithMany(p => p.WorkCollaborator)
                   .HasForeignKey(d => d.ComposerId)
                   .OnDelete(DeleteBehavior.ClientSetNull)
                   .HasConstraintName("FK_WorkCollaborators_Person");

                entity.HasOne(d => d.Work)
                    .WithMany(p => p.WorkCollaborator)
                    .HasForeignKey(d => d.WorkId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WorkCollaborators_Work");
            });

            modelBuilder.Entity<WorkRecording>(entity =>
            {
                entity.Property(e => e.AmountRevenue).HasColumnType("decimal(10, 2)");

                entity.Property(e => e.Notes)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Rating).HasColumnType("decimal(4, 1)");

                entity.Property(e => e.RecordingDate).HasColumnType("datetime");

                entity.Ignore(e => e.RecordingDateString);
            });

            modelBuilder.Entity<Category>(entity =>
            {

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator).HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(150);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Key)
                    .IsRequired()
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .HasDefaultValueSql("('')");

                entity.Ignore(e => e.ProjectTypeId);

                entity.Ignore(e => e.FatherId);
            });

            modelBuilder.Entity<Contract>(entity =>
            {
                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator).HasMaxLength(450);

                entity.Property(e => e.Description).HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.ContractTypeName);

                entity.Ignore(e => e.LocalCompanyName);
            });

            modelBuilder.Entity<ProjectBudget>(entity =>
            {
                entity.Property(e => e.Budget).HasColumnType("decimal(12, 2)");

                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Notes)
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Spent).HasColumnType("decimal(12, 2)");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ProjectBudget)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProjectBudget_Category");
            });

            modelBuilder.Entity<ProjectBudgetDetail>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Spent).HasColumnType("decimal(12, 2)");

                entity.HasOne(d => d.Category)
                    .WithMany(p => p.ProjectBudgetDetail)
                    .HasForeignKey(d => d.CategoryId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProjectBudgetDetail_Category");

                entity.HasOne(d => d.ProjectBudget)
                    .WithMany(p => p.ProjectBudgetDetail)
                    .HasForeignKey(d => d.ProjectBudgetId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ProjectBudgetDetail_ProjectBudget");

                entity.Ignore(e => e.DateString);

            });

            modelBuilder.Entity<Marketing>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator).HasMaxLength(450);

                entity.Property(e => e.DescriptionHeaderOverviewMaterial)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.DescriptionHeaderPlan)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.DescriptionKeyIdeas)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.GeneralInformation)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Ignore(e => e.StartDateString);

                entity.Ignore(e => e.EndDateString);

                entity.Ignore(e => e.ArtistName);

                entity.Ignore(e => e.ArtistPictureUrl);
            });

            modelBuilder.Entity<ConfigurationMarketingTemplate>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.Language);
            });            

            modelBuilder.Entity<Editor>(entity =>
            {
                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Dba)
                    .IsRequired()
                    .HasColumnName("DBA")
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<StatusModule>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<ProjectLabelCopy>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.DateLastUpdate).HasColumnType("datetime");

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<Request>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.UserId);

                entity.Ignore(e => e.UserName);

                entity.Ignore(e => e.PictureUrl);

                entity.Ignore(e => e.Users);

            });

            modelBuilder.Entity<ProjectTravelLogistics>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);
            });

            modelBuilder.Entity<Permission>(entity =>
            {
                entity.Property(e => e.ActionName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.ControllerName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.IsRequired)
                    .IsRequired()
                    .HasDefaultValueSql("((1))");

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<RolProfilePermission>(entity =>
            {
                entity.HasOne(d => d.Permission)
                    .WithMany(p => p.RolProfilePermission)
                    .HasForeignKey(d => d.PermissionId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RolProfilePermission_Permission");
            });

            modelBuilder.Entity<ConfigurationProjectBudgetCategory>(entity =>
            {
                entity.Ignore(e => e.CategoryName);
            });

            modelBuilder.Entity<Terms>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);
            });

            modelBuilder.Entity<TermType>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Ignore(e => e.ContractTerms);

            });

            modelBuilder.Entity<ContractTerms>(entity =>
            {
                entity.Ignore(e => e.TermTypeId);
            });

            modelBuilder.Entity<MarketingDemographic>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.Percentage).HasColumnType("decimal(5, 2)");
            });

            modelBuilder.Entity<MarketingPlan>(entity =>
            {
                entity.Property(e => e.EstimatedDateVerification).HasColumnType("datetime");

                entity.Property(e => e.Notes)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                //entity.Ignore(e => e.Name);

                entity.Ignore(e => e.EstimatedDateVerificationString);

                //entity.Ignore(e => e.Complete);

                entity.Ignore(e => e.Users);
            });

            modelBuilder.Entity<NotificationWeb>(entity =>
            {
                entity.Property(e => e.Created).HasColumnType("datetime");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450);

                entity.Property(e => e.Message)
                    .IsRequired()
                    .HasMaxLength(1024);
            });

            modelBuilder.Entity<MarketingPlanAutorize>(entity =>
            {
                entity.Property(e => e.Notes)
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.VerificationDate).HasColumnType("datetime");

                entity.Ignore(e => e.VerificationDateString);

            });

            modelBuilder.Entity<ContractStatus>(entity =>
            {
                entity.Property(e => e.Notes)
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Created).HasColumnType("datetime");
            });

            modelBuilder.Entity<Goal>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<MarketingGoals>(entity =>
            {
                entity.Property(e => e.CurrentQuantity).HasColumnType("decimal(12, 2)");

                entity.Property(e => e.GoalQuantity).HasColumnType("decimal(12, 2)");

                entity.HasOne(d => d.Goal)
                    .WithMany(p => p.MarketingGoals)
                    .HasForeignKey(d => d.GoalId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MarketingGoals_Goal");

                entity.Ignore(e => e.SocialNetworkName);

                entity.Ignore(e => e.PictureURL);

                entity.Ignore(e => e.GoalName);

            });

            modelBuilder.Entity<MarketingGoalsAudited>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Quantity).HasColumnType("decimal(12, 2)");

                entity.Ignore(e => e.DateString);

                entity.Ignore(e => e.SocialNetworkName);

                entity.Ignore(e => e.PictureURL);

                entity.Ignore(e => e.ArtistPictureURL);

                entity.Ignore(e => e.Variation);
            });

            modelBuilder.Entity<PlayList>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Ignore(e => e.SocialNetworkTypeName);
            });

            modelBuilder.Entity<MarketingOverview>(entity =>
            {
                entity.Property(e => e.DescriptionExt)
                    .IsRequired()
                    .HasMaxLength(200)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<Media>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PictureUrl)
                    .IsRequired()
                    .HasMaxLength(250)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<KeyIdeasType>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<MarketingKeyIdeasBudget>(entity =>
            {
                entity.Property(e => e.PercentageBudget).HasColumnType("decimal(5, 1)");

                entity.Property(e => e.Target)
                    .IsRequired()
                    .HasMaxLength(30)
                    .IsUnicode(false);

                entity.Ignore(e => e.CategoryId);
            });

            modelBuilder.Entity<ConfigurationMarketingKeyIdeasCategory>(entity =>
            {
                entity.Property(e => e.KeyIdeasTypeId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<MarketingOverViewDetail>(entity =>
            {
                entity.Ignore(e => e.Name);
                entity.Ignore(e => e.PictureUrl);
                entity.Ignore(e => e.SocialNetwork);
                entity.Ignore(e => e.SectionId);
            });

            modelBuilder.Entity<ProjectWorkAdmin>(entity =>
            {
                entity.HasOne(d => d.Editor);
            });

            modelBuilder.Entity<MarketingAsset>(entity =>
            {
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Url)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<KeyIdeas>(entity =>
            {

                entity.Ignore(e => e.PictureUrl);
                entity.Ignore(e => e.SocialNetwork);
                entity.Ignore(e => e.MarketingKeyIdeasNameId);

            });

            modelBuilder.Entity<MarketingCalendar>(entity =>
            {
                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.FromDate).HasColumnType("datetime");

                entity.Property(e => e.ToDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<ContractTermType>(entity =>
            {
                entity.Ignore(e => e.TermTypeName);
            });

            modelBuilder.Entity<Publisher>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.Association)
                    .WithMany(p => p.Publisher)
                    .HasForeignKey(d => d.AssociationId)
                    .HasConstraintName("FK_Publisher_Association");
            });

            modelBuilder.Entity<Association>(entity =>
            {
                entity.Property(e => e.Abbreviation)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Created)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Creator)
                    .IsRequired()
                    .HasMaxLength(450)
                    .HasDefaultValueSql("('SYSTEM')");

                entity.Property(e => e.Erased).HasColumnType("datetime");

                entity.Property(e => e.Eraser).HasMaxLength(450);

                entity.Property(e => e.Iswc)
                    .HasColumnName("ISWC")
                    .HasMaxLength(50);

                entity.Property(e => e.Modified).HasColumnType("datetime");

                entity.Property(e => e.Modifier).HasMaxLength(450);

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.StatusRecordId).HasDefaultValueSql("((1))");
            });

            modelBuilder.Entity<Publisher>(entity =>
            {
                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.Association)
                    .WithMany(p => p.Publisher)
                    .HasForeignKey(d => d.AssociationId)
                    .HasConstraintName("FK_Publisher_Association");
            });

            modelBuilder.Entity<WorkPublisher>(entity =>
            {
                entity.Property(e => e.AmountRevenue)
                    .HasColumnType("decimal(10, 2)")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.PercentageRevenue)
                    .HasColumnType("decimal(10, 2)")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.Association)
                    .WithMany(p => p.WorkPublisher)
                    .HasForeignKey(d => d.AssociationId)
                    .HasConstraintName("FK_WorkPublisher_Association");

                entity.HasOne(d => d.Publisher)
                    .WithMany(p => p.WorkPublisher)
                    .HasForeignKey(d => d.PublisherId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WorkPublisher_Publisher");

                entity.HasOne(d => d.Work)
                    .WithMany(p => p.WorkPublisher)
                    .HasForeignKey(d => d.WorkId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WorkPublisher_Work");
            });
        }
    }
}
