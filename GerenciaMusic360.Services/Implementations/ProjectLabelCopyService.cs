using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectLabelCopyService : Repository<ProjectLabelCopy>, IProjectLabelCopyService
    {
        public ProjectLabelCopyService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ProjectLabelCopy GetByProject(int projectId) =>
        Find(w => w.ProjectId == projectId);

        ProjectLabelCopy IProjectLabelCopyService.Get(int id) =>
        Find(w => w.Id == id);

        ProjectLabelCopy IProjectLabelCopyService.Create(ProjectLabelCopy labelCopy) =>
        Add(labelCopy);

        void IProjectLabelCopyService.Update(ProjectLabelCopy labelCopy) =>
        Update(labelCopy, labelCopy.Id);

        void IProjectLabelCopyService.Delete(ProjectLabelCopy labelCopy) =>
        Delete(labelCopy);
    }
}
