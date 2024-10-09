namespace GerenciaMusic360.Entities
{
    public partial class MarketingOverViewDetail
    {
        public int Id { get; set; }
        public int MarketingOverviewId { get; set; }
        public int? SocialNetworkTypeId { get; set; }
        public int? PlayListId { get; set; }
        public short? MediaId { get; set; }
        public int? MaterialId { get; set; }
        public short Position { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public string SocialNetwork { get; set; }
        public int SectionId { get; set; }
    }
}
