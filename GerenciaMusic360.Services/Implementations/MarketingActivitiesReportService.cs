using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class MarketingActivitiesReportService : Repository<MarketingActivitiesReport>, IMarketingActivitiesReport
    {
        public MarketingActivitiesReportService(Context_DB context) : base(context)
        {
        }

        public IEnumerable<MarketingActivitiesReport> GetMarketingActivitiesByUser(int userId)
        {
            DbCommand cmd = LoadCmd("GetMarketingActivitiesByUser");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<MarketingActivitiesReport> GetActivesMarketingActivitiesByUser(int userId)
        {
            DbCommand cmd = LoadCmd("GetActivesMarketingActivitiesByUser");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }
    }
}
