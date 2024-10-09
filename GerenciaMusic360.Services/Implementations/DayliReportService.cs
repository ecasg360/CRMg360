using System;
using System.Collections.Generic;
using System.Text;
//Custom libraries added as in Metas 
using System.Data.Common;
using System.Linq;
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class DayliReportService : Repository<DayliReport>, IDayliReportService
    {
        public DayliReportService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<DayliReport> GetByUserAndDate(string InitialDate, int UserId)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetDayliReportByUserAndDate");
                cmd = AddParameter(cmd, "UserId", UserId);
                cmd = AddParameter(cmd, "InitialDate", InitialDate);
                return ExecuteReader(cmd);
            }
            catch (Exception e)
            {
                return null;
            }
        }
        public IEnumerable<DayliReport> GetReportByUserId(int UserId)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetReport");
                cmd = AddParameter(cmd, "Id", UserId);
            
                return ExecuteReader(cmd);

            }
            catch (Exception e)
            {
                return null;
            }

        }

        public DayliReport GetRecord(int Id)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetReport");
                cmd = AddParameter(cmd, "Id", Id);
                return ExecuteReader(cmd).First();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public DayliReport CreateRecord(DayliReport model) =>
        Add(model);

        public void UpdateRecord(DayliReport model) =>
        Update(model, model.Id);

        public void DeleteRecord(DayliReport model) =>
        Delete(model);
    }
}
