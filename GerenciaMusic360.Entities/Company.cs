using System;

namespace GerenciaMusic360.Entities
{
    public partial class Company
    {
        public int Id { get; set; }
        public string BusinessName { get; set; }
        public string LegalName { get; set; }
        public string BusinessShortName { get; set; }
        public string TaxId { get; set; }
        public int RepresentativeLegalId { get; set; }
        public int AddressId { get; set; }
        public short? StatusRecordId { get; set; }
        public DateTime? Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
