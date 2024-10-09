using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ProjectTravelLogistics
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int CategoryId { get; set; }
        public short TravelLogisticsTypeId { get; set; }
        public short Position { get; set; }
        public decimal TotalCost { get; set; }
        public short IsInternal { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
        [NotMapped]
        public string ProjectName { get; set; }
        [NotMapped]
        public string CategoryName { get; set; }
        [NotMapped]
        public string TravelLogisticsTypeName { get; set; }
        public int ProjectBudgetDetailId { get; set; }
    }
}
