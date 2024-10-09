namespace GerenciaMusic360.Entities
{
    public partial class MarketingAsset
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public short Position { get; set; }
    }
}
