using System;

namespace GerenciaMusic360.Entities
{
    public class Currency
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public int CountryId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }

        public virtual Country Country { get; set; }
    }
}
