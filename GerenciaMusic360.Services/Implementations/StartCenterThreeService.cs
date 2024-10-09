using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class StartCenterThreeService : Repository<StartCenterThree>, IStartCenterThreeService
    {
        public StartCenterThreeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<StartCenterThree> GetStartCenterThree(int type)
        {
            DbCommand cmd = null;
            switch (type)
            {
                case 1:
                    cmd = LoadCmd("GetStartCenterProjectLast");
                    break;
                case 2:
                    cmd = LoadCmd("GetStartCenterMarketingLast");
                    break;
                case 3:
                    cmd = LoadCmd("GetStartCenterContractLast");
                    break;
            }
            return ExecuteReader(cmd);
        }
    }
}
