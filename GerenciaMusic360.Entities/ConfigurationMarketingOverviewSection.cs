namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationMarketingOverviewSection
    {
        public short Id { get; set; }
        public short ConfigurationId { get; set; }
        public short SectionId { get; set; }
        public short Position { get; set; }
        public bool Active { get; set; }
    }
}
