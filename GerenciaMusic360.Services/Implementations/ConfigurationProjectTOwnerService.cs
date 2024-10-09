using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationProjectTOwnerService : Repository<ConfigurationProjectTypeOwner>, IConfigurationProjectTOwnerService
    {
        public ConfigurationProjectTOwnerService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ConfigurationProjectTypeOwner GetConfigurationProjectTypeOwne(int projectTypeId) =>
        Find(w => w.ProjectTypeId == projectTypeId);
    }
}
