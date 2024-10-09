using System;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectBudgetDetail
    {
        public int Id { get; set; }
        public int ProjectBudgetId { get; set; }
        public int CategoryId { get; set; }
        public decimal Spent { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; }

        public Category Category { get; set; }
        public ProjectBudget ProjectBudget { get; set; }

        public string DateString { get; set; }
    }
}
