using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class StartCenterOneService : Repository<StartCenterOne>, IStartCenterOneService
    {
        public StartCenterOneService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<StartCenterOne> GetStartCenterOne(int type, int year)
        {
            DbCommand cmd = null;
            switch (type)
            {
                case 1:
                    cmd = LoadCmd("GetStartCenterProyectYear");
                    break;
                case 2:
                    cmd = LoadCmd("GetStartCenterMarketingYear");
                    break;
                case 3:
                    cmd = LoadCmd("GetStartCenterContractYear");
                    break;
            }
            cmd = AddParameter(cmd, "Year", year);
            return ExecuteReader(cmd);
        }
    }
}
