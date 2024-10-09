using System;

namespace GerenciaMusic360.Entities
{
    public partial class MarketingPlanAutorize
    {
        public int Id { get; set; }
        public int MarketingPlanId { get; set; }
        public long UserVerificationId { get; set; }
        public DateTime? VerificationDate { get; set; }
        public string Notes { get; set; }
        public bool Checked { get; set; }
        public string VerificationDateString { get; set; }
    }
}
