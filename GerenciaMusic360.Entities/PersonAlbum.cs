using System;

namespace GerenciaMusic360.Entities
{
    public partial class PersonAlbum
    {
        public int Id { get; set; }
        public int? PersonId { get; set; }
        public int? AlbumId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
    }
}
