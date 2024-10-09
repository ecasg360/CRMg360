using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class VisaTypeService : Repository<VisaType>, IVisaTypeService
    {
        public VisaTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<VisaType> GetAllVisaTypes()
        {
            DbCommand cmd = LoadCmd("GetAllVisaTypes");
            return ExecuteReader(cmd);
        }

        public VisaType GetVisaType(short id)
        {
            DbCommand cmd = LoadCmd("GetVisaType");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }
    }
}
