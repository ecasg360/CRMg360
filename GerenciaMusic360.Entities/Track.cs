using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class Track
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; }
        public int? NumberTrack { get; set; }
        public string Time { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public string ISRC { get; set; }

    }
}
