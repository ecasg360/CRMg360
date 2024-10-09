namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationTask
    {
        public short ConfigurationId { get; set; }
        public short? EntityTypeId { get; set; }
        public int TaskDocumentId { get; set; }
        public int TemplateTaskDocumentDetailId { get; set; }
        public bool Active { get; set; }
        public int Id { get; set; }
        public short Position { get; set; }
        public int ModuleId { get; set; }
    }
}
