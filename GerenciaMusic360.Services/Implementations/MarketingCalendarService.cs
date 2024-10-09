using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingCalendarService : Repository<MarketingCalendar>, IMarketingCalendarService
    {
        public MarketingCalendarService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        MarketingCalendar IMarketingCalendarService.Create(MarketingCalendar marketingCalendar) =>
        Add(marketingCalendar);

        void IMarketingCalendarService.Delete(MarketingCalendar marketingCalendar) =>
        Delete(marketingCalendar);

        MarketingCalendar IMarketingCalendarService.Get(int id) =>
        Get(id);

        IEnumerable<MarketingCalendar> IMarketingCalendarService.GetAll(int marketingId) =>
        FindAll(w => w.MarketingId == marketingId);

        void IMarketingCalendarService.Update(MarketingCalendar marketingCalendar) =>
        Update(marketingCalendar, marketingCalendar.Id);
    }
}
