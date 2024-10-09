using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingCalendarService
    {
        IEnumerable<MarketingCalendar> GetAll(int marketingId);
        MarketingCalendar Get(int id);
        MarketingCalendar Create(MarketingCalendar marketingCalendar);
        void Update(MarketingCalendar marketingCalendar);
        void Delete(MarketingCalendar marketingCalendar);
    }
}
