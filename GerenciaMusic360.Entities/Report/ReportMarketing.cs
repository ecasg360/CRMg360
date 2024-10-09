using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Entities.Report
{
    public class ReportMarketing
    {
        public string Artist { get; set; }
        public string Project { get; set; }
        public string SocialNetworkType { get; set; }
        public DateTime TheDate { get; set; }
        public int GoalTotalQuantity { get; set; }
        public int GoalTotalCurrent { get; set; }
        public int GoalQuantity { get; set; }
    }
}
