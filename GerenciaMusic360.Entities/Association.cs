using System;
using System.Collections;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Association
    {
        public Association()
        {
            Publisher = new HashSet<Publisher>();
            WorkPublisher = new HashSet<WorkPublisher>();
        }

        public short Id { get; set; }
        public int? CountryId { get; set; }
        public string Abbreviation { get; set; }
        public string Name { get; set; }
        public string Iswc { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }

        public ICollection<Publisher> Publisher { get; set; }
        public ICollection<WorkPublisher> WorkPublisher { get; set; }
    }
}
