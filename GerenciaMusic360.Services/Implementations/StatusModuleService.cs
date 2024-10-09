using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class StatusModuleService : Repository<StatusModule>, IStatusModuleService
    {
        public StatusModuleService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateStatusModule(StatusModule status) =>
        Add(status);

        public void DeleteStatusModule(StatusModule status) =>
        Delete(status);

        public IEnumerable<StatusModule> GetAllStatusByModule(int moduleId)
        {
            return _context.StatusModule.Where(x => x.ModuleId == moduleId).ToList();
        }


        public StatusModule GetStatusModule(int id) =>
        Find(w => w.Id == id);

        public void UpdateStatusModule(StatusModule status) =>
        Update(status, status.Id);
    }
}
