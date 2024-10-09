namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationProjectTypeOwner
    {
        public short Id { get; set; }
        public short ConfigurationId { get; set; }
        public int ProjectTypeId { get; set; }
        public short DefaultProjectOwnerId { get; set; }
    }
}
