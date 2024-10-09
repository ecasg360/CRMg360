using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class PreferenceTypeService : Repository<PreferenceType>, IPreferenceTypeService
    {
        public PreferenceTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PreferenceType> GetAllPreferenceTypes()
        {
            DbCommand cmd = LoadCmd("GetAllPreferenceTypes");
            return ExecuteReader(cmd);
        }
    }
}
