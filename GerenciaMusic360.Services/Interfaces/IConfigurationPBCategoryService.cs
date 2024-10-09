using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigurationPBCategoryService
    {
        ConfigurationProjectBudgetCategory GetConfigurationProjectBudgetCategory(int projectTypeId, int categoryId);
        ConfigurationProjectBudgetCategory CreateConfigurationProjectBudgetCategory(ConfigurationProjectBudgetCategory configurationProjectBudgetCategory);
        void DeleteConfigurationProjectBudgetCategory(ConfigurationProjectBudgetCategory configurationProjectBudgetCategory);
        IEnumerable<ConfigurationProjectBudgetCategory> GetByProjectTypeId(int projectTypeId);
    }
}
