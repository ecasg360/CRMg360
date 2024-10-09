using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ProjectTravelLogisticsHotel
    {
        public int Id { get; set; }
        public int ProjectTravelLogisticsId { get; set; }
        public string Name { get; set; }
        public int AddressId { get; set; }
        public string RoomNumber { get; set; }
        public string ReservationName { get; set; }
        public decimal TotalCost { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public string CountryName { get; set; }
        [NotMapped]
        public string StateName { get; set; }
        [NotMapped]
        public string CityName { get; set; }
        [NotMapped]
        public int IsInternal { get; set; }
    }
}
