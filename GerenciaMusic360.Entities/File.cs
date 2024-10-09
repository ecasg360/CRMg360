using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class Files
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string Path { get; set; }
        public int ModuleId { get; set; }
        public int RowId { get; set; }
        public string Hash { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public string ModuleName { get; set; }
        [NotMapped]
        public string FileURL { get; set; }
        [NotMapped]
        public string FileExtention { get; set; }
    }
}
