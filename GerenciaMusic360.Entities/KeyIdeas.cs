namespace GerenciaMusic360.Entities
{
    public partial class KeyIdeas
    {
        public short Id { get; set; }
        public short KeyIdeasTypeId { get; set; }
        public int CategoryId { get; set; }
        public int? SocialNetworkTypeId { get; set; }
        public string Name { get; set; }
        public short Position { get; set; }
        public string PictureUrl { get; set; }
        public string SocialNetwork { get; set; }
        public int MarketingKeyIdeasNameId { get; set; }
    }
}
