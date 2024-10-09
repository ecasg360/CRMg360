namespace GerenciaMusic360.Entities
{
    public partial class MarketingGoals
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public int GoalId { get; set; }
        public bool? Overcome { get; set; }
        public long? UserVerificationId { get; set; }
        public bool Audited { get; set; }
        public decimal GoalQuantity { get; set; }
        public decimal CurrentQuantity { get; set; }
        public int? SocialNetworkTypeId { get; set; }
        public string SocialNetworkName { get; set; }
        public string PictureURL { get; set; }
        public string GoalName { get; set; }

        public Goal Goal { get; set; }
    }
}
