using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationImageUserService : Repository<ConfigurationImageUser>, IConfigurationImageUserService
    {
        public ConfigurationImageUserService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateConfigurationImageUser(ConfigurationImageUser configurationImageUser)
        {
            ConfigurationImageUser currentConfiguration = Find(w => w.UserId == configurationImageUser.UserId);
            if (currentConfiguration != null)
            {
                currentConfiguration.ConfigurationImageId = configurationImageUser.ConfigurationImageId;
                Update(currentConfiguration, currentConfiguration.Id);
            }
            else
                Add(configurationImageUser);
        }
    }
}
