using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class ForeignWork
    {
        public ForeignWork()
        {
            ForeignWorkPerson = new HashSet<ForeignWorkPerson>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreationDate { get; set; }
        public ICollection<ForeignWorkPerson> ForeignWorkPerson { get; set; }
    }
}
