using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ContractStatus
    {
        public short Id { get; set; }
        public int ContractId { get; set; }
        public int StatusId { get; set; }
        public DateTime Date { get; set; }
        public string Notes { get; set; }
        public long UserVerificationId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }

        [NotMapped]
        public virtual StatusModule StatusModule { get; set; }
    }
}
