using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class CompanyService : Repository<Company>, ICompanyService
    {
        public CompanyService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Company> GetAllCompanies() =>
        FindAll(w => w.StatusRecordId != 3);

        public Company GetCompany(int id) =>
        Find(w => w.Id == id);

        public Company CreateCompany(Company company) =>
        Add(company);

        public void UpdateCompany(Company company) =>
        Update(company, company.Id);

        public void DeleteCompany(Company company) =>
        Delete(company);
    }
}
