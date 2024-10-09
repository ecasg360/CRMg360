using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingActivitiesReport
    {
        IEnumerable<MarketingActivitiesReport> GetMarketingActivitiesByUser(int userId);
        IEnumerable<MarketingActivitiesReport> GetActivesMarketingActivitiesByUser(int userId);
    }
}
