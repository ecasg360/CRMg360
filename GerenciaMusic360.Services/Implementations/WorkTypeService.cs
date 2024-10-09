using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class WorkTypeService : Repository<WorkType>, IWorkTypeService
    {
        public WorkTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<WorkType> GetAllWorkTypes()
        {
            DbCommand cmd = LoadCmd("GetAllWorkTypes");
            return ExecuteReader(cmd);
        }

        public WorkType GetWorkType(int id)
        {
            DbCommand cmd = LoadCmd("GetWorkType");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateWorkType(WorkType workType) =>
        Add(workType);

        public void UpdateWorkType(WorkType workType) =>
        Update(workType, workType.Id);

        public void DeleteWorkType(WorkType workType) =>
        Delete(workType);
    }
}
