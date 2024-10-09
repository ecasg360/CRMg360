using System;

namespace GerenciaMusic360.Entities
{
    public class ComposerDetail
    {
        public int Id { get; set; }
        public short AssociationId { get; set; }
        public short EditorId { get; set; }
        public int ComposerId { get; set; }
        public string IPI { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }

        public virtual Association Association { get; set; }
        public virtual Editor Editor { get; set; }

    }
}
