using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICompanyService
    {
        IEnumerable<Company> GetAllCompanies();
        Company GetCompany(int id);
        Company CreateCompany(Company company);
        void UpdateCompany(Company company);
        void DeleteCompany(Company company);
    }
}
