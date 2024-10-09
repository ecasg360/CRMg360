using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class PersonPreferenceModel
    {
        public int PreferenceTypeId { get; set; }
        public string PreferenceTypeName { get; set; }
        public List<PreferenceModel> Preferences { get; set; }
    }
    public class PreferenceModel
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public int PreferenceId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string PictureURL { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
    }
}
