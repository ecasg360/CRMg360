using System;

namespace GerenciaMusic360.Entities
{
    public partial class PersonPreference
    {
        public int Id { get; set; }
        public int PreferenceId { get; set; }
        public int PersonId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
        public int? PreferenceTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PictureURL { get; set; }
        public string PreferenceTypeName { get; set; }
    }
}
