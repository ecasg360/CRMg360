using GerenciaMusic360.Entities.Report;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces.Report
{
    public interface IReportMarketingService
    {
        List<ReportMarketing> GetReport(int marketingId);
    }
}
