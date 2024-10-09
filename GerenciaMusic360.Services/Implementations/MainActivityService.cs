using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MainActivityService : Repository<MainActivity>, IMainActivityService
    {
        public MainActivityService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<MainActivity> GetAllMainActivities()
        {
            DbCommand cmd = LoadCmd("GetAllMainActivities");
            return ExecuteReader(cmd);
        }

        public MainActivity GetMainActivity(int id)
        {
            DbCommand cmd = LoadCmd("GetMainActivity");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public MainActivity CreateMainActivity(MainActivity mainActivity) =>
        Add(mainActivity);

        public MainActivity UpdateMainActivity(MainActivity mainActivity) =>
        Update(mainActivity, mainActivity.Id);

        public void DeleteMainActivity(MainActivity mainActivity) =>
        Delete(mainActivity);
    }
}
