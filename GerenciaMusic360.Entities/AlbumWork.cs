using System;

namespace GerenciaMusic360.Entities
{
    public partial class AlbumWork
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int AlbumId { get; set; }
        public bool IsInternal { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
    }
}
