using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class TrackWork
    {
        public int Id { get; set; }
        public int TrackId { get; set; }
        public string ISRC { get; set; }
        public string UPC { get; set; }
    }
}
