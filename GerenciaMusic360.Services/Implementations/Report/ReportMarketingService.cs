using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces.Report;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations.Report
{
    public class ReportMarketingService : Repository<ReportMarketing>, IReportMarketingService
    {

        public ReportMarketingService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public List<ReportMarketing> GetReport(int marketingId)
        {
            DbCommand cmd = LoadCmd("GetReportMarketing");
            cmd = AddParameter(cmd, "MarketingId", marketingId);
            return (List<ReportMarketing>)ExecuteReader(cmd);
        }
    }
}
