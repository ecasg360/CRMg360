using System;

namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationImage
    {
        public short Id { get; set; }
        public short ConfigurationId { get; set; }
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public bool IsDefault { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string Name { get; set; }
    }
}
