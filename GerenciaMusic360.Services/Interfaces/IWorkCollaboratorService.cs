using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IWorkCollaboratorService
    {
        IEnumerable<WorkCollaborator> GetWorkCollaboratorsByWork(int workId);
        WorkCollaborator GetWorkCollaborator(int workId, int personId);
        IEnumerable<WorkCollaborator> GetWorkCollaboratorsByWorkComposer(int workId);
        void CreateWorkCollaborators(List<WorkCollaborator> workCollaborators);
        void CreateWorkCollaborator(WorkCollaborator workCollaborator);
        void UpdateWorkCollaborator(WorkCollaborator workCollaborator);
        void DeleteWorkCollaborator(WorkCollaborator workCollaborator);
        void DeleteWorkCollaborators(IEnumerable<WorkCollaborator> workCollaborators);
    }
}
