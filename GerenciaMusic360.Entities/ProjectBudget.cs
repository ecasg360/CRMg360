using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectBudget
    {

        public ProjectBudget()
        {
            ProjectBudgetDetail = new HashSet<ProjectBudgetDetail>();
        }

        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int CategoryId { get; set; }
        public decimal Budget { get; set; }
        public decimal Spent { get; set; }
        public string Notes { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }

        public Category Category { get; set; }
        public IEnumerable<ProjectBudgetDetail> ProjectBudgetDetail { get; set; }
    }
}
