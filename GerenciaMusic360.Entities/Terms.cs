using System;

namespace GerenciaMusic360.Entities
{
    public class Terms
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public short TermTypeId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }

        public virtual TermType TermType { get; set; }
    }
}
