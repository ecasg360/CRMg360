namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationTaskAutorize
    {
        public int ConfigurationTaskId { get; set; }
        public long UserProfileId { get; set; }
        public bool Active { get; set; }
        public int Id { get; set; }
        public string UserProfileName { get; set; }
        public bool UserProfileAuthorized { get; set; }
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; }
    }
}
