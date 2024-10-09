using System;

namespace GerenciaMusic360.Entities.Models
{
    public class PersonAddressModel
    {
        public int Id { get; set; }
        public string ArtistAlias { get; set; }
        public string Name { get; set; }
        public string LastName { get; set; }
        public string SecondLastName { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Gender { get; set; }
        public string PassportNumber { get; set; }
        public DateTime? ExpiredPassportDate { get; set; }
        public DateTime? ExpiredVisaDate { get; set; }
        public string PictureUrl { get; set; }
        public decimal? Price { get; set; }
        public string Email { get; set; }
        public string PhoneOne { get; set; }
        public string PhoneTwo { get; set; }
        public string PhoneThree { get; set; }
        public string GeneralTaste { get; set; }
        public bool HasPassport { get; set; }
        public int PassportCountryId { get; set; }
        public string Biography { get; set; }
        public short PersonTypeId { get; set; }
        public int MusicalGenreId { get; set; }
        public short? VisaTypeId { get; set; }
        public int? TripPreferenceId { get; set; }
        public int? RepresentativeId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public int EntityId { get; set; }
        public string BirthDateString { get; set; }
        public string ExpiredPassportDateString { get; set; }
        public string ExpiredVisaDateString { get; set; }
        //===Address===
        public int AddressId { get; set; }
        public short AddressTypeId { get; set; }
        public int PersonId { get; set; }
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
        public short AddressStatusRecordId { get; set; }
    }
}
