using System;

namespace GerenciaMusic360.Entities
{
    public partial class Address
    {
        public int Id { get; set; }
        public short AddressTypeId { get; set; }
        public int? PersonId { get; set; }
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
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string ArrayGoogle { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string CountryName { get; set; }
        public string StateName { get; set; }
        public string CityName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string State { get; set; }
    }
}
