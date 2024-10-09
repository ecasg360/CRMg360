using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProductionTypeService : Repository<ProductionType>, IProductionTypeService
    {
        public ProductionTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ProductionType> GetAllProductionTypes()
        {
            DbCommand cmd = LoadCmd("GetAllProductionTypes");
            return ExecuteReader(cmd);
        }
    }
}
