using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectEvent
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public DateTime EventDate { get; set; }
        public string Venue { get; set; }
        public int LocationId { get; set; }
        public decimal Deposit { get; set; }
        public DateTime? DepositDate { get; set; }
        public decimal? LastPayment { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public decimal? Guarantee { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
        [NotMapped]
        public string LocationName { get; set; }
    }
}
