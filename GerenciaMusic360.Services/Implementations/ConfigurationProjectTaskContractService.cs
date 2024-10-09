using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ConfigurationProjectTaskContractService : Repository<ConfigurationProjectTaskContract>, IConfigurationProjectTaskContractService
    {
        public ConfigurationProjectTaskContractService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ConfigurationProjectTaskContract> GetAllConfigurations() =>
        GetAll();

        public IEnumerable<ConfigurationProjectTaskContract> GetAllByProjectTypeId(int projectTypeId)
        {
            return _context.ConfigurationProjectTaskContract.Include(r => r.ContractType).Where(x => x.ProjectTypeId == projectTypeId).ToList();
        }

    }
}
