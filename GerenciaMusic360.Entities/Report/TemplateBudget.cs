using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Report
{
    public class TemplateBudget
    {
        public int Id { get; set; }
        public string ArtistName { get; set; }
        public decimal PercentageArtist { get; set; }
        public List<BudgetEvent> Events { get; set; }

        public decimal Musicians { get; set; }
        public decimal Engineer { get; set; }
        public decimal Flights { get; set; }
        public decimal Transportation { get; set; }
        public decimal Gas { get; set; }
        public decimal Hotels { get; set; }
        public decimal Meals { get; set; }
        public decimal Sobrepeso { get; set; }
        public decimal SpecialEffects { get; set; }
        public decimal MiscExpense { get; set; }
    }

    public class BudgetEvent
    {
        public int? Id { get; set; }
        public DateTime EventDate { get; set; }
        public decimal? Deposit { get; set; }
        public decimal? LastPayment { get; set; }
        public DateTime? DepositDate { get; set; }
        public DateTime? LastPaymentDate { get; set; }
        public decimal TotalBudget { get; set; }
        public string Venue { get; set; }
        public string Location { get; set; }
    }
}
