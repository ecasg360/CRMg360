using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Entities
{
    public class MarketingActivitiesReport
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public string MarketingName { get; set; }
        public DateTime EstimatedDateVerification { get; set; }
        public short Required { get; set; }
        public short Status { get; set; }
        public string TaskName { get; set; }
        public long UserId { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public bool Complete { get; set; }

    }
}
