using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class Publisher
    {
        public Publisher()
        {
            WorkPublisher = new HashSet<WorkPublisher>();
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public short? AssociationId { get; set; }

        public virtual Association Association { get; set; }
        public ICollection<WorkPublisher> WorkPublisher { get; set; }
    }
}
