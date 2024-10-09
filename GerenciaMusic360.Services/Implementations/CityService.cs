using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class CityService : Repository<City>, ICityService
    {
        public CityService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<City> GetAllCities()
        {
            DbCommand cmd = LoadCmd("GetAllCities");
            return ExecuteReader(cmd);
        }

        public IEnumerable<City> GetCitiesByState(int stateId)
        {
            DbCommand cmd = LoadCmd("GetCitiesByState");
            cmd = AddParameter(cmd, "StateId", stateId);
            return ExecuteReader(cmd);
        }
    }
}
