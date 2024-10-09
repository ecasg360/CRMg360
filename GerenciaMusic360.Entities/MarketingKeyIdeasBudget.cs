namespace GerenciaMusic360.Entities
{
    public partial class MarketingKeyIdeasBudget
    {
        public int Id { get; set; }
        public int MarketingKeyIdeasId { get; set; }
        public string Target { get; set; }
        public decimal? PercentageBudget { get; set; }
        public int CategoryId { get; set; }
        public int? SocialNetworkId { get; set; }
    }
}
