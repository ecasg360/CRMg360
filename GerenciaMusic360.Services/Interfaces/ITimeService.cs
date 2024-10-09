using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITimeService
    {
        IEnumerable<Time> GetAllTimes();
        IEnumerable<Time> GetTimesByModule(int moduleId);
        Time GetTime(int id);
        Time CreateTime(Time time);
        void UpdateTime(Time time);
    }
}
