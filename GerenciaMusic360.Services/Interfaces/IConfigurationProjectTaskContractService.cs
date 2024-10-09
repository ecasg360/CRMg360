using GerenciaMusic360.Entities.Models;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigurationProjectTaskContractService
    {
        IEnumerable<ConfigurationProjectTaskContract> GetAll();

        IEnumerable<ConfigurationProjectTaskContract> GetAllByProjectTypeId(int projectTypeId);
    }
}
