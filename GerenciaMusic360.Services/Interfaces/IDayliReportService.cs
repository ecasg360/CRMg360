using System;
using System.Collections.Generic;
using System.Text;
using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IDayliReportService
    {
       // IEnumerable<DayliReport> GetCurrentWeek(string InitialDate);
         IEnumerable<DayliReport> GetByUserAndDate(string InitialDate, int UserId);
        IEnumerable<DayliReport> GetReportByUserId(int UserId);
        DayliReport GetRecord(int Id);
        DayliReport CreateRecord(DayliReport model);
        void UpdateRecord(DayliReport model);
        void DeleteRecord(DayliReport model);
    }
}
