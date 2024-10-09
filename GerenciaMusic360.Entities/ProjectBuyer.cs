namespace GerenciaMusic360.Entities
{
    public partial class ProjectBuyer
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public short BuyerTypeId { get; set; }
        public int? PersonId { get; set; }
        public int? CompanyId { get; set; }

        public virtual BuyerType BuyerType { get; set; }
        public virtual Person Person { get; set; }
        public virtual Company Company { get; set; }

    }
}
