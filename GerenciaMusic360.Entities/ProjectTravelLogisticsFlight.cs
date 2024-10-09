using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectTravelLogisticsFlight
    {
        public int Id { get; set; }
        public int ProjectTravelLogisticsId { get; set; }
        public short AirLineId { get; set; }
        public string FlightNumber { get; set; }
        public string PassengerName { get; set; }
        public string PassengerSeat { get; set; }
        public DateTime? DepartureDate { get; set; }
        public string DepartureCity { get; set; }
        public DateTime? ArrivalDate { get; set; }
        public string ArrivalCity { get; set; }
        public decimal TotalCost { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public string AirLineName { get; set; }
        [NotMapped]
        public int IsInternal { get; set; }
    }
}
