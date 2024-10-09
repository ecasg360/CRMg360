namespace GerenciaMusic360.Entities.Models
{
    public class ConfigurationProjectTaskContract
    {
        public int Id { get; set; }
        public int ProjectTypeId { get; set; }
        public short ContractTypeId { get; set; }
        public int? TaskDocumentDetailId { get; set; }
        public bool Required { get; set; }
        public short ConfigurationId { get; set; }

        public virtual ContractType ContractType { get; set; }
    }
}
