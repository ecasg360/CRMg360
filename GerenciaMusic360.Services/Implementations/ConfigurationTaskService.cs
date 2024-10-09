using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationTaskService : Repository<ConfigurationTask>, IConfigurationTaskService
    {
        public ConfigurationTaskService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ConfigurationTask CreateConfigurationTasks(ConfigurationTask model) =>
        Add(model);

        //public ConfigurationTask GetNewCTIdPosition(int typeId)
        //{
        //    DbCommand cmd = LoadCmd("GetNewCTIdPosition");
        //    cmd = AddParameter(cmd, "TypeId", typeId);
        //    return ExecuteReader(cmd).First();
        //}

        public int GetNewCTIdPosition(int typeId)
        {
            ConfigurationTask lastConfiguration = FindAll(w => w.EntityTypeId == typeId)
                  .OrderByDescending(o => o.Position)
                  .FirstOrDefault();
            return lastConfiguration != null ? lastConfiguration.Position + 1 : 1;
        }
    }
}
