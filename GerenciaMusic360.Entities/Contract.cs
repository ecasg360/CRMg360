using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class Contract
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public short? TimeId { get; set; }
        public int? CurrencyId { get; set; }
        public short? LocalCompanyId { get; set; }
        public bool HasAmount { get; set; }
        public decimal? Amount { get; set; }
        public short ContractTypeId { get; set; }
        public short? ContractStatusId { get; set; }
        public short? FileId { get; set; }
        public short? LanguageId { get; set; }
        public int? ProjectTaskId { get; set; }
        public int? ProjectId { get; set; }
        public short? StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }

        public virtual Time Time { get; set; }
        public virtual Currency Currency { get; set; }
        public virtual ContractType ContractType { get; set; }
        public virtual LocalCompany LocalCompany { get; set; }

        [NotMapped]
        public ContractStatus ContractStatus { get; set; }

        public virtual Language Language { get; set; }
        //public virtual ProjectTask ProjectTask { get; set; }
        public string ContractTypeName { get; set; }
        public string LocalCompanyName { get; set; }

    }
}
