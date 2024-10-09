using System;

namespace GerenciaMusic360.Entities
{
    public partial class Album
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string NumRecord { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public DateTime? ReleaseDate { get; set; }
        public string PictureUrl { get; set; }
        public int PersonRelationId { get; set; }
        public string ReleaseDateString { get; set; }
        public string PersonRelationName { get; set; }
    }
}
