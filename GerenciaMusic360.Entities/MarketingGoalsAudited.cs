using System;

namespace GerenciaMusic360.Entities
{
    public partial class MarketingGoalsAudited
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public int SocialNetworkTypeId { get; set; }
        public DateTime Date { get; set; }
        public decimal Quantity { get; set; }
        public long UserVerificationId { get; set; }
        public string DateString { get; set; }
        public string SocialNetworkName { get; set; }
        public string PictureURL { get; set; }
        public string ArtistPictureURL { get; set; }
        public decimal Variation { get; set; }
    }
}
