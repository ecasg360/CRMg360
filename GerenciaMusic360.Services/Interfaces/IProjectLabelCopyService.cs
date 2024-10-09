using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectLabelCopyService
    {
        ProjectLabelCopy GetByProject(int projectId);
        ProjectLabelCopy Get(int id);
        ProjectLabelCopy Create(ProjectLabelCopy labelCopy);
        void Update(ProjectLabelCopy labelCopy);
        void Delete(ProjectLabelCopy labelCopy);
    }
}
