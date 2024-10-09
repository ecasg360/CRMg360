using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingGoalsAuditedService : Repository<MarketingGoalsAudited>, IMarketingGoalsAuditedService
    {
        public MarketingGoalsAuditedService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingGoalsAudited IMarketingGoalsAuditedService.Create(MarketingGoalsAudited marketingGoalsAudited) =>
        Add(marketingGoalsAudited);

        IEnumerable<MarketingGoalsAudited> IMarketingGoalsAuditedService.Create(List<MarketingGoalsAudited> marketingGoalsAuditeds) =>
        AddRange(marketingGoalsAuditeds);

        IEnumerable<MarketingGoalsAudited> IMarketingGoalsAuditedService.Get(DateTime date, int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingGoalsAudited");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            cmd = AddParameter(cmd, "Date", date);
            return CalculateVariation(ExecuteReader(cmd));
        }

        IEnumerable<MarketingGoalsAudited> IMarketingGoalsAuditedService.GetByMarketing(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingGoalsAuditedByMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return CalculateVariation(ExecuteReader(cmd));
        }

        IEnumerable<MarketingGoalsAudited> IMarketingGoalsAuditedService.GetByMarketingReport(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetMarketingGoalsAuditedByMarketingReport");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return CalculateVariation(ExecuteReader(cmd));
        }

        void IMarketingGoalsAuditedService.Delete(IEnumerable<MarketingGoalsAudited> marketingGoalsAuditeds) =>
        DeleteRange(marketingGoalsAuditeds);

        private IEnumerable<MarketingGoalsAudited> CalculateVariation(IEnumerable<MarketingGoalsAudited> source)
        {
            IEnumerable<int> socialNetworksId = source.Select(s => s.SocialNetworkTypeId)
                              .Distinct();

            foreach (int socialNetwork in socialNetworksId)
            {
                IEnumerable<MarketingGoalsAudited> socials =
                    source.Where(w => w.SocialNetworkTypeId == socialNetwork).OrderBy(o => o.Date);

                MarketingGoalsAudited last = null;
                foreach (MarketingGoalsAudited social in socials)
                {
                    if (last != null)
                    {
                        decimal lastQuantity = last.Quantity > 0 ? last.Quantity : 1;
                        social.Variation = ((social.Quantity - last.Quantity) / lastQuantity) * 100;
                    }
                    last = social;
                }
            }
            return source;
        }

        IEnumerable<MarketingGoalsAudited> IMarketingGoalsAuditedService.GetBySocialNetwork(int socialNetworkId) =>
        FindAll(w => w.SocialNetworkTypeId == socialNetworkId);


    }
}
