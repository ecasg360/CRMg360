using System;

namespace GerenciaMusic360.Entities
{
    public partial class MembersGroup
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string MainActivity { get; set; }
        public int? IdArtist { get; set; }
        public DateTime BirthDate { get; set; }
        public DateTime EntryDate { get; set; }
        public short StatusRecordId { get; set; }
        public string PictureURL { get; set; }
    }
}
