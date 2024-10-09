using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingPlanHeaderService : Repository<MarketingPlanHeader>, IMarketingPlanHeaderService
    {
        public MarketingPlanHeaderService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingPlanHeader IMarketingPlanHeaderService.Get(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingPlanHeader");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return ExecuteReader(cmd).First();
        }
    }
}
