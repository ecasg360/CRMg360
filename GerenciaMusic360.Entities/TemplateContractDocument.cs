namespace GerenciaMusic360.Entities
{
    public class TemplateContractDocument
    {
        public short Id { get; set; }
        public string DocumentName { get; set; }
        public int ContractTypeId { get; set; }
        public string MarkerStartDate { get; set; }
        public string MarkerEndDate { get; set; }
        public string MarkerTime { get; set; }
        public string MarkerCurrency { get; set; }
        public string MarkerLocalCompany { get; set; }
        public string MarkerAmount { get; set; }
        public string MarkerAmountLetter { get; set; }
        public string MarkerTerms { get; set; }
        public string MarkerPersonGM360 { get; set; }
        public string MarkerPersonContract { get; set; }
        public string MarkerAddressGM360 { get; set; }
        public string MarkerInitialsG360 { get; set; }
    }
}
