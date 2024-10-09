using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public int ProjectTypeId { get; set; }
        public int? LocationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CurrencyId { get; set; }
        public decimal? TotalBudget { get; set; }
        public DateTime InitialDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
        public int StatusProjectId { get; set; }
        public string StatusProjectName { get; set; }

        //public virtual ProjectType ProjectType { get; set; }
        //public virtual IEnumerable<ProjectState> ProjectStates { get; set; }
        //public List<ProjectTaskAutorize> ProjectTaskAutorizes { get; set; }
        public string CurrencyCode { get; set; }
        public string CurrencyDescription { get; set; }
        public string ProjectTypeName { get; set; }
        public string LocationName { get; set; }
        //public virtual Currency Currency { get; set; }
        //public virtual Location Location { get; set; }

        public decimal BudgetSpent { get; set; }
        public short OwnerId { get; set; }

        public string UPCCode { get; set; }

        public string Venue { get; set; }
        public decimal? Deposit { get; set; }
        public DateTime? DepositDate { get; set; }
        public decimal? LastPayment { get; set; }
        public DateTime? LastPaymentDate { get; set; }

        public string PictureUrl { get; set; }
        public int? ArtistId { get; set; }
        public string ArtistName { get; set; }
        public decimal? Spent { get; set; }
    }
}
