namespace GerenciaMusic360.Entities
{
    public partial class ContractTermType
    {
        public int Id { get; set; }
        public short TermTypeId { get; set; }
        public int ContractId { get; set; }
        public string TermTypeName { get; set; }
    }
}
