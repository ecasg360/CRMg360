using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class WorkRecording
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int ArtistId { get; set; }
        public DateTime? RecordingDate { get; set; }
        public decimal? Rating { get; set; }
        public decimal? AmountRevenue { get; set; }
        public string Notes { get; set; }
        public string RecordingDateString { get; set; }
        [NotMapped]
        public Person Detail { get; set; }
    }
}
