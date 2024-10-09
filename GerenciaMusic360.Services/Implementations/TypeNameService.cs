using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class TypeNameService : Repository<TypeName>, ITypeNameService
    {
        public TypeNameService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<TypeName> GetAllTypeNames()
        {
            DbCommand cmd = LoadCmd("GetAllTypeNames");
            return ExecuteReader(cmd);
        }
    }
}
