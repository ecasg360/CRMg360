using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationPBCategoryService : Repository<ConfigurationProjectBudgetCategory>, IConfigurationPBCategoryService
    {
        public ConfigurationPBCategoryService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ConfigurationProjectBudgetCategory CreateConfigurationProjectBudgetCategory(ConfigurationProjectBudgetCategory configurationProjectBudgetCategory)
        {
            return Add(configurationProjectBudgetCategory);
        }

        public void DeleteConfigurationProjectBudgetCategory(ConfigurationProjectBudgetCategory configurationProjectBudgetCategory)
        {
            Delete(configurationProjectBudgetCategory);
        }

        public ConfigurationProjectBudgetCategory GetConfigurationProjectBudgetCategory(int projectTypeId, int categoryId)
        {
            return Find(w => w.ProjectTypeId == projectTypeId & w.CategoryId == categoryId);
        }

        public IEnumerable<ConfigurationProjectBudgetCategory> GetByProjectTypeId(int projectTypeId)
        {
            DbCommand cmd = LoadCmd("GetConfigurationPBCategory");
            cmd = AddParameter(cmd, "ProjectTypeId", projectTypeId);
            return ExecuteReader(cmd);
        }
    }
}
