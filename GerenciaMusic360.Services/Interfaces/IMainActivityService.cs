using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMainActivityService
    {
        IEnumerable<MainActivity> GetAllMainActivities();
        MainActivity GetMainActivity(int id);
        MainActivity CreateMainActivity(MainActivity mainActivity);
        MainActivity UpdateMainActivity(MainActivity mainActivity);
        void DeleteMainActivity(MainActivity mainActivity);
    }
}
