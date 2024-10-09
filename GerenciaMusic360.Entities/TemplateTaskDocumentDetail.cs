using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class TemplateTaskDocumentDetail
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public short Position { get; set; }
        public int TemplateTaskDocumentId { get; set; }
        public string TemplateTaskDocumentName { get; set; }
        public List<long> UsersAuthorize { get; set; }
        public string EstimatedDateVerficationString { get; set; }
        public bool Required { get; set; }
        public bool IsPermanent { get; set; }
        public int ProjectId { get; set; }
        public short EntityId { get; set; }

    }
}
