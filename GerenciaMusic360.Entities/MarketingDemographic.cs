namespace GerenciaMusic360.Entities
{
    public partial class MarketingDemographic
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public string Name { get; set; }
        public decimal Percentage { get; set; }
    }
}
