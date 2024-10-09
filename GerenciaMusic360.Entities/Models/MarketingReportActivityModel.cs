using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Entities.Models
{
    public class MarketingReportActivityModel
    {
        public int ActivityType { get; set; }
        public string UserName { get; set; }
        public IEnumerable<IGrouping<int, MarketingActivitiesReport>> Tasks { get; set; }
    }
}
