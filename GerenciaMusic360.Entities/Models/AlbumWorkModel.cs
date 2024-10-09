using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class AlbumWorkModel
    {
        public int id { get; set; }
        public string name { get; set; }
        public int numRecord { get; set; }
        public string pictureUrl { get; set; }
        public DateTime? releaseDate { get; set; }
        public string releaseDateString { get; set; }
        public IEnumerable<Work> works { get; set; }
    }
}
