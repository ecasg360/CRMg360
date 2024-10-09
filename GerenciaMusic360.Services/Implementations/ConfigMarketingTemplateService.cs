using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigMarketingTemplateService : Repository<ConfigurationMarketingTemplate>, IConfigMarketingTemplateService
    {
        public ConfigMarketingTemplateService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<ConfigurationMarketingTemplate> IConfigMarketingTemplateService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetConfigurationMarketingTemplate");
            return ExecuteReader(cmd);
        }

        ConfigurationMarketingTemplate IConfigMarketingTemplateService.Get(int id) =>
        Find(w => w.Id == id);

        ConfigurationMarketingTemplate IConfigMarketingTemplateService.Create(ConfigurationMarketingTemplate configuration) =>
        Add(configuration);

        void IConfigMarketingTemplateService.Update(ConfigurationMarketingTemplate configuration) =>
        Update(configuration, configuration.Id);

        void IConfigMarketingTemplateService.Delete(ConfigurationMarketingTemplate configuration) =>
        Delete(configuration);
    }
}
