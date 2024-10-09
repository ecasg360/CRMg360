namespace GerenciaMusic360.Entities
{
    public partial class LocalCompany
    {
        public short Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public string Title { get; set; }
        public int? PersonId { get; set; }
        public int? AddressId { get; set; }
    }
}
