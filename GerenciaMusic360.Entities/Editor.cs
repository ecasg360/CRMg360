using System;

namespace GerenciaMusic360.Entities
{
    public partial class Editor
    {
        public short Id { get; set; }
        public string Dba { get; set; }
        public short? LocalCompanyId { get; set; }
        public short AssociationId { get; set; }
        public bool IsInternal { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string Name { get; set; }


        public virtual Association Association { get; set; }
    }
}
