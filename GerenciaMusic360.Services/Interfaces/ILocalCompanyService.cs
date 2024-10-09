using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ILocalCompanyService
    {
        IEnumerable<LocalCompany> GetAllLocalCompanies();
    }
}
