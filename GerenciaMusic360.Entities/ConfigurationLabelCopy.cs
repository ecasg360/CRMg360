namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationLabelCopy
    {
        public short Id { get; set; }
        public short ConfigurationId { get; set; }
        public short DistributorDefaultId { get; set; }
        public int PersonProducerExecutiveDefaultId { get; set; }
        public int PersonProducerExecutiveWorkDefaultId { get; set; }
        public int PersonRecordingEngineerDefaultId { get; set; }
        public int PersonMixMasterDefaultId { get; set; }
        public int PersonRemixMasterDefaultId { get; set; }
        public short StudioDefaultId { get; set; }
    }
}
