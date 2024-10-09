using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class TimeService : Repository<Time>, ITimeService
    {
        public TimeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Time> GetAllTimes()
        {
            DbCommand cmd = LoadCmd("GetAllTimes");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Time> GetTimesByModule(int moduleId) =>
        FindAll(w => w.StatusRecordId != 2 & w.ModuleId == moduleId);

        public Time GetTime(int id) =>
        Find(w => w.Id == id);

        public Time CreateTime(Time time) =>
        Add(time);

        public void UpdateTime(Time time) =>
        Update(time, time.Id);


    }
}
