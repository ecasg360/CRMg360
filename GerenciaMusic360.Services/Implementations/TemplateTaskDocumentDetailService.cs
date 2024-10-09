using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class TemplateTaskDocumentDetailService : Repository<TemplateTaskDocumentDetail>, ITemplateTaskDocumentDetailService
    {
        public TemplateTaskDocumentDetailService(Context_DB context) : base(context)
        {
        }

        public TemplateTaskDocumentDetail CreateTemplate(TemplateTaskDocumentDetail model) =>
        Add(model);

        public IEnumerable<TemplateTaskDocumentDetail> getByProjectType(int projectTypeId)
        {
            DbCommand cmd = LoadCmd("GetAllConfigurationTaskAndDocumentDetails");
            cmd = AddParameter(cmd, "projectTypeId", projectTypeId);
            return ExecuteReader(cmd);
        }

        public TemplateTaskDocumentDetail GetNewTTDDIdPosition(string variable, int typeId)
        {
            DbCommand cmd = LoadCmd("GetNewTTDDIdPosition");
            cmd = AddParameter(cmd, "Variable", variable);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<TemplateTaskDocumentDetail> getByProjectTask(int projectTaskId)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<TemplateTaskDocumentDetail> getByTemplateTask(int templateTaskId)
        {
            DbCommand cmd = LoadCmd("GetAllConfigurationTaskAndDocumentDetails");
            cmd = AddParameter(cmd, "taskDocumentId", templateTaskId);
            return ExecuteReader(cmd);
        }

        public TemplateTaskDocumentDetail GetTemplate(int id) =>
        Get(id);

        public TemplateTaskDocumentDetail UpdateTemplate(TemplateTaskDocumentDetail model) =>
        Update(model, model.Id);

        public void DeleteTemplate(TemplateTaskDocumentDetail model) =>
        Delete(model);

        public IEnumerable<TemplateTaskDocumentDetail> CreateTemplates(List<TemplateTaskDocumentDetail> templates) =>
        AddRange(templates);
    }
}
