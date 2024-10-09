using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingAssetService : Repository<MarketingAsset>, IMarketingAssetService
    {
        public MarketingAssetService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingAsset IMarketingAssetService.Create(MarketingAsset asset) =>
        Add(asset);

        void IMarketingAssetService.Delete(MarketingAsset asset) =>
        Delete(asset);

        MarketingAsset IMarketingAssetService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingAsset> IMarketingAssetService.GetAll(int marketingId) =>
        FindAll(w => w.MarketingId == marketingId);

        void IMarketingAssetService.Update(MarketingAsset asset) =>
        Update(asset, asset.Id);
    }
}
