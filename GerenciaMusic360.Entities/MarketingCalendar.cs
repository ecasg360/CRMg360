using System;

namespace GerenciaMusic360.Entities
{
    public partial class MarketingCalendar
    {
        public int Id { get; set; }
        public int MarketingId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string Description { get; set; }
    }
}
