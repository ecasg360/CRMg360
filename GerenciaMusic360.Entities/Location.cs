using System;

namespace GerenciaMusic360.Entities
{
    public class Location
    {
        public int Id { get; set; }
        public int AddressId { get; set; }
        public int Capacity { get; set; }
        public string WebSite { get; set; }
        public string PictureUrl { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }

        public virtual Address Address { get; set; }
    }
}
