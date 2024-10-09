using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigMarketingTemplateService
    {
        IEnumerable<ConfigurationMarketingTemplate> GetAll();
        ConfigurationMarketingTemplate Get(int id);
        ConfigurationMarketingTemplate Create(ConfigurationMarketingTemplate configuration);
        void Update(ConfigurationMarketingTemplate configuration);
        void Delete(ConfigurationMarketingTemplate configuration);
    }
}
