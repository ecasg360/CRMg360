using System;

namespace GerenciaMusic360.Entities
{
    public partial class CertificationAuthority
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string BusinessName { get; set; }
        public string Phone { get; set; }
        public string Contact { get; set; }
        public int AddressId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
