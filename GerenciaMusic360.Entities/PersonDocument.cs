using System;

namespace GerenciaMusic360.Entities
{
    public partial class PersonDocument
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public short PersonDocumentTypeId { get; set; }
        public int? CountryId { get; set; }
        public string Number { get; set; }
        public DateTime EmisionDate { get; set; }
        public DateTime ExpiredDate { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public short StatusRecordId { get; set; }
        public string ExpiredDateString { get; set; }
        public string EmisionDateString { get; set; }
        public string LegalName { get; set; }
    }
}
