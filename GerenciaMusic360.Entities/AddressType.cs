using System;

namespace GerenciaMusic360.Entities
{
    public partial class AddressType
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
