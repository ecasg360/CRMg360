namespace GerenciaMusic360.Entities
{
    public class ContractTerms
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int TermId { get; set; }
        public short Position { get; set; }
        public int TermTypeId { get; set; }

        public virtual Terms Term { get; set; }
    }
}
