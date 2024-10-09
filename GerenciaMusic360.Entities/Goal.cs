using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Goal
    {
        public Goal()
        {
            MarketingGoals = new HashSet<MarketingGoals>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }

        public ICollection<MarketingGoals> MarketingGoals { get; set; }
    }
}
