using System;

namespace GerenciaMusic360.Entities
{
    public partial class CalendarDetails
    {
        public int Id { get; set; }
        public int CalendarId { get; set; }
        public string Name { get; set; }
        public DateTime CreateDate { get; set; }
        public int? TaskDocumentId { get; set; }
        public int? TaskDocumentDetailId { get; set; }
        public bool Closed { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
