using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class LocalCompanyService : Repository<LocalCompany>, ILocalCompanyService
    {
        public LocalCompanyService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<LocalCompany> GetAllLocalCompanies() =>
        GetAll();
    }
}
