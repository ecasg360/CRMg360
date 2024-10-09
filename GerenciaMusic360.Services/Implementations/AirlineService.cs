using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class AirlineService : Repository<AirLine>, IAirlineService
    {
        public AirlineService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<AirLine> GetAllAirlines()
        {
            DbCommand cmd = LoadCmd("GetAllAirlines");
            return ExecuteReader(cmd);
        }

    }
}
