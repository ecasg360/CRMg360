using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class AutoBrandService : Repository<AutoBrand>, IAutoBrandService
    {
        public AutoBrandService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<AutoBrand> GetAllAutoBrands()
        {
            DbCommand cmd = LoadCmd("GetAllAutoBrands");
            return ExecuteReader(cmd);
        }

    }
}
