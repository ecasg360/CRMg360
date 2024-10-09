using System;

namespace GerenciaMusic360.Entities
{
    public partial class Time
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public short TimeTypeId { get; set; }
        public bool WithRange { get; set; }
        public int InitialValue { get; set; }
        public int FinalValue { get; set; }
        public int ModuleId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string TimeTypeName { get; set; }
    }
}
