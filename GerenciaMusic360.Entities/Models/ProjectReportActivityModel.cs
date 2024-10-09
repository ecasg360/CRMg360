using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Entities.Models
{
    public class ProjectReportActivityModel
    {
        public int ActivityType { get; set; }
        public string UserName { get; set; }
        public IEnumerable<IGrouping<int, ProjectTask>> Tasks { get; set; }
    }
}
