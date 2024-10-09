using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectTask
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Notes { get; set; }
        public bool Completed { get; set; }
        public int TemplateTaskDocumentDetailId { get; set; }
        public DateTime EstimatedDateVerfication { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public bool Required { get; set; }
        public bool Status { get; set; }
        public string EstimatedDateVerficationString { get; set; }
        public int TemplateTaskDocumentId { get; set; }
        public string TemplateTaskDocumentName { get; set; }
        public string TemplateTaskDocumentDetailName { get; set; }
        public short Position { get; set; }
        public int? ProjectIdRelation { get; set; }
        public long UserProfileId { get; set; }
        public string UserProfileName { get; set; }
        public bool UserProfileAuthorized { get; set; }
        public int ConfigurationTaskId { get; set; }
        public int? DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public List<ConfigurationTaskAutorize> Users { get; set; }
        public int hasContractPending { get; set; }
        public string CalendarNotes { get; set; }
        public string  ProjectName { get; set; }
    }
}
