using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ControlledListService : Repository<ControlledList>, IControlledListService
    {
        public ControlledListService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<ControlledList> GetControlledList()
        {
            DbCommand cmd = LoadCmd("GetControlledList");
            return ExecuteReader(cmd);
        }
    }
}
