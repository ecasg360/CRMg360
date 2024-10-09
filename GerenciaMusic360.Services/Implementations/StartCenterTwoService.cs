using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class StartCenterTwoService : Repository<StartCenterTwo>, IStartCenterTwoService
    {
        public StartCenterTwoService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<StartCenterTwo> GetStartCenterTwo(int type, int year)
        {
            DbCommand cmd = null;
            switch (type)
            {
                case 1:
                    cmd = LoadCmd("GetStartCenterProyectStatus");
                    break;
                case 2:
                    cmd = LoadCmd("GetStartCenterMarketingStatus");
                    break;
                case 3:
                    cmd = LoadCmd("GetStartCenterContractStatus");
                    break;
            }
            cmd = AddParameter(cmd, "Year", year);
            return ExecuteReader(cmd);
        }
    }
}
