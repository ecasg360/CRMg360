using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class FieldValue
    {
        public int Id { get; set; }
        public int FieldId { get; set; }
        public int ModuleId { get; set; }
        public int DocumentId { get; set; }
        public string Value { get; set; }
        [NotMapped]
        public short FieldTypeId { get; set; }
        [NotMapped]
        public string Key { get; set; }
        [NotMapped]
        public string Text { get; set; }
        [NotMapped]
        public string ValueDefault { get; set; }
        [NotMapped]
        public short Dimension { get; set; }
        [NotMapped]
        public short ModuleTypeId { get; set; }
        [NotMapped]
        public short Position { get; set; }
        [NotMapped]
        public bool Required { get; set; }
        [NotMapped]
        public string Marker { get; set; }
        [NotMapped]
        public short StatusRecordId { get; set; }
    }
}
