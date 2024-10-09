using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ProjectTravelLogisticsTransportation
    {
        public int Id { get; set; }
        public int ProjectTravelLogisticsId { get; set; }
        public bool OwnVehicle { get; set; }
        public short AutoBrandId { get; set; }
        public string VehicleName { get; set; }
        public string Agency { get; set; }
        public decimal TotalCost { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        [NotMapped]
        public int IsInternal { get; set; }
        [NotMapped]
        public short AutoBrandName { get; set; }
    }
}
