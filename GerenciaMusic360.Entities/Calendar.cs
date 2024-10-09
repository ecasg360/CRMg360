using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class Calendar
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public short? AllDay { get; set; }
        public string PictureUrl { get; set; }
        public short Checked { get; set; }
        public string Location { get; set; }
        public string Notes { get; set; }
        public short StatusRecordId { get; set; }
        public int PersonId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public int? ProjectTaskId { get; set; }
        public bool ProjectTaskIsMember { get; set; }
        public string StartDateString { get; set; }
        public string EndDateString { get; set; }
        public bool? Locked { get; set; }
        public int? ProjectId { get; set; }
        public int? ModuleId { get; set; }
        [NotMapped]
        public string ArtistName { get; set; }
        [NotMapped]
        public bool? IsProjectRelease { get; set; }

    }
}
