using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigurationTaskService
    {
        ConfigurationTask CreateConfigurationTasks(ConfigurationTask model);
        int GetNewCTIdPosition(int typeId);
    }
}
