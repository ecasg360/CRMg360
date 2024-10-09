using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITemplateTaskDocumentDetailService
    {
        TemplateTaskDocumentDetail CreateTemplate(TemplateTaskDocumentDetail template);
        IEnumerable<TemplateTaskDocumentDetail> CreateTemplates(List<TemplateTaskDocumentDetail> templates);
        IEnumerable<TemplateTaskDocumentDetail> getByProjectType(int projectTypeId);
        IEnumerable<TemplateTaskDocumentDetail> getByProjectTask(int projectTaskId);
        IEnumerable<TemplateTaskDocumentDetail> getByTemplateTask(int templateTaskId);
        TemplateTaskDocumentDetail GetTemplate(int id);
        TemplateTaskDocumentDetail GetNewTTDDIdPosition(string variable, int typeId);
        TemplateTaskDocumentDetail UpdateTemplate(TemplateTaskDocumentDetail template);
        void DeleteTemplate(TemplateTaskDocumentDetail model);
    }
}
