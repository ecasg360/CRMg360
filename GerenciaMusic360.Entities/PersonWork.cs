using System;

namespace GerenciaMusic360.Entities
{
    public partial class PersonWork
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int PersonId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
