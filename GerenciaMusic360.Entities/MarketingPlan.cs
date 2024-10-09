using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class MarketingPlan
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public int TaskDocumentDetailId { get; set; }
        public short Position { get; set; }
        public string Notes { get; set; }
        public DateTime? EstimatedDateVerification { get; set; }
        public bool Required { get; set; }
        public bool Status { get; set; }
        public string Name { get; set; }
        public string EstimatedDateVerificationString { get; set; }
        public bool? Complete { get; set; }
        public List<int> Users { get; set; }
    }
}
