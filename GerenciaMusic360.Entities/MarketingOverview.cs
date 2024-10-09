namespace GerenciaMusic360.Entities
{
    public partial class MarketingOverview
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public short SectionId { get; set; }
        public string DescriptionExt { get; set; }
        public short Position { get; set; }
    }
}
