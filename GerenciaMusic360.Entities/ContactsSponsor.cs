using System;

namespace GerenciaMusic360.Entities
{
    public partial class ContactsSponsor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondLastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Gender { get; set; }
        public string PictureUrl { get; set; }
        public string Email { get; set; }
        public string PhoneOne { get; set; }
        public string PhoneTwo { get; set; }
        public int? CountryId { get; set; }
        public int? StateId { get; set; }
        public int? CityId { get; set; }
        public string Municipality { get; set; }
        public string Neighborhood { get; set; }
        public string Street { get; set; }
        public string ExteriorNumber { get; set; }
        public string InteriorNumber { get; set; }
        public string PostalCode { get; set; }
        public string Reference { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string BirthDateString { get; set; }
    }
}
