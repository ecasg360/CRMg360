using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IWorkTypeService
    {
        IEnumerable<WorkType> GetAllWorkTypes();
        WorkType GetWorkType(int id);
        void CreateWorkType(WorkType workType);
        void UpdateWorkType(WorkType workType);
        void DeleteWorkType(WorkType workType);
    }
}
