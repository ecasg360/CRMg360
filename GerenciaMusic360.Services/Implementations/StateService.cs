using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class StateService : Repository<State>, IStateService
    {
        public StateService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<State> GetAllStates()
        {
            DbCommand cmd = LoadCmd("GetAllStates");
            return ExecuteReader(cmd);
        }

        public IEnumerable<State> GetStatesByCountry(int countryId)
        {
            DbCommand cmd = LoadCmd("GetStatesByCountry");
            cmd = AddParameter(cmd, "CountryId", countryId);
            return ExecuteReader(cmd);
        }
    }
}
