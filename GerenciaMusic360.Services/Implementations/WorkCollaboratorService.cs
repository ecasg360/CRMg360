using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class WorkCollaboratorService : Repository<WorkCollaborator>, IWorkCollaboratorService
    {
        public WorkCollaboratorService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateWorkCollaborator(WorkCollaborator workCollaborator) =>
        Add(workCollaborator);

        public void CreateWorkCollaborators(List<WorkCollaborator> workCollaborators) =>
        AddRange(workCollaborators);

        public void DeleteWorkCollaborator(WorkCollaborator workCollaborator) =>
        Delete(workCollaborator);

        public void DeleteWorkCollaborators(IEnumerable<WorkCollaborator> workCollaborators) =>
        DeleteRange(workCollaborators);

        public WorkCollaborator GetWorkCollaborator(int workId, int personId) =>
        Find(w => w.WorkId == workId & w.ComposerId == personId);

        public IEnumerable<WorkCollaborator> GetWorkCollaboratorsByWork(int workId) =>
        FindAll(w => w.WorkId == workId);

        public IEnumerable<WorkCollaborator> GetWorkCollaboratorsByWorkComposer(int workId)
        {
            return _context.WorkCollaborator.Include(r => r.Composer).Where(x => x.WorkId == workId).ToList();
        }

        public void UpdateWorkCollaborator(WorkCollaborator workCollaborator) =>
        Update(workCollaborator, workCollaborator.Id);

    }
}
