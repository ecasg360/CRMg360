using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class TermType
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }


        public virtual List<ContractTerms> ContractTerms { get; set; }
    }
}
