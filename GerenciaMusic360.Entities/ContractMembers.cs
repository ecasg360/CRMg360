namespace GerenciaMusic360.Entities
{
    public class ContractMembers
    {
        public int Id { get; set; }
        public int ContractId { get; set; }
        public int PersonId { get; set; }
        public int? CompanyId { get; set; }
        public short ContractRoleId { get; set; }

        public virtual Person Person { get; set; }
        public virtual Company Company { get; set; }
        public virtual ContractRole ContractRole { get; set; }

    }
}
