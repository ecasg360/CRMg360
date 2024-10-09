using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class CountryService : Repository<Country>, ICountryService
    {
        public CountryService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Country> GetAllCountries()
        {
            DbCommand cmd = LoadCmd("GetAllCountries");
            return ExecuteReader(cmd);
        }

        public Country GetCountry(int id)
        {
            DbCommand cmd = LoadCmd("GetCountry");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateCountry(Country country) =>
        Add(country);

        public void UpdateCountry(Country country) =>
        Update(country, country.Id);

        public void DeleteCountry(Country country) =>
        Delete(country);
    }
}
