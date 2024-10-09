using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingOverviewDService : Repository<MarketingOverViewDetail>, IMarketingOverviewDService
    {
        public MarketingOverviewDService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<MarketingOverViewDetail> IMarketingOverviewDService.GetByOverView(int overviewId) =>
        FindAll(f => f.MarketingOverviewId == overviewId);

        IEnumerable<MarketingOverViewDetail> IMarketingOverviewDService.GetByOverView(int overviewId, int socialNetworkId) =>
        FindAll(f => f.MarketingOverviewId == overviewId & f.SocialNetworkTypeId == socialNetworkId);

        MarketingOverViewDetail IMarketingOverviewDService.Create(MarketingOverViewDetail marketingOverviewDetail) =>
        Add(marketingOverviewDetail);

        void IMarketingOverviewDService.Delete(MarketingOverViewDetail marketingOverViewDetail) =>
        Delete(marketingOverViewDetail);

        MarketingOverViewDetail IMarketingOverviewDService.Get(int id) =>
        Get(id);

        //IEnumerable<MarketingOverViewDetail> IMarketingOverviewDService.GetAll(int marketingOverviewId) =>
        //FindAll(w => w.MarketingOverviewId == marketingOverviewId);

        void IMarketingOverviewDService.DeleteAll(IEnumerable<MarketingOverViewDetail> details) => DeleteRange(details);
        IEnumerable<MarketingOverViewDetail> IMarketingOverviewDService.GetAll(int marketingOverviewId)
        {
            DbCommand cmd = LoadCmd("GetMarketingOverviewDetail");
            cmd = AddParameter(cmd, "MarketingOverviewId", marketingOverviewId);
            return ExecuteReader(cmd);
        }

        IEnumerable<MarketingOverViewDetail> IMarketingOverviewDService.GetByMarketing(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingOverviewDetailByMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return ExecuteReader(cmd);
        }
    }
}
