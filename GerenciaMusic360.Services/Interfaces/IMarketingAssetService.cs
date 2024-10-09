using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingAssetService
    {
        IEnumerable<MarketingAsset> GetAll(int marketingId);
        MarketingAsset Get(int id);
        MarketingAsset Create(MarketingAsset asset);
        void Update(MarketingAsset asset);
        void Delete(MarketingAsset assetlo);
    }
}
