using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class Field
    {
        public int Id { get; set; }
        public short FieldTypeId { get; set; }
        public string Key { get; set; }
        public string Text { get; set; }
        public string ValueDefault { get; set; }
        public int ModuleId { get; set; }
        public short Dimension { get; set; }
        public short? ModuleTypeId { get; set; }
        public short Position { get; set; }
        public bool Required { get; set; }
        public string Marker { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public string FieldTypeName { get; set; }
        [NotMapped]
        public string ModuleName { get; set; }
        [NotMapped]
        public string ModuleTypeName { get; set; }
        [NotMapped]
        public string Masked { get; set; }
        [NotMapped]
        public int FieldValueId { get; set; }
        [NotMapped]
        public string Value { get; set; }
    }
}
