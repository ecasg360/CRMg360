using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Category
    {
        public Category()
        {
            ProjectBudget = new HashSet<ProjectBudget>();
            ProjectBudgetDetail = new HashSet<ProjectBudgetDetail>();
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public int StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string PictureUrl { get; set; }
        public string Key { get; set; }
        public int ModuleId { get; set; }
        public int Id { get; set; }
        public int ProjectTypeId { get; set; }
        public int FatherId { get; set; }

        public Module Module { get; set; }
        public ICollection<ProjectBudget> ProjectBudget { get; set; }
        public ICollection<ProjectBudgetDetail> ProjectBudgetDetail { get; set; }
    }
}
