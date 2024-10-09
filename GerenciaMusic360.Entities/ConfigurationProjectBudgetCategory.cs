namespace GerenciaMusic360.Entities
{
    public partial class ConfigurationProjectBudgetCategory
    {
        public short Id { get; set; }
        public short ConfigurationId { get; set; }
        public int? ProjectTypeId { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }
}
