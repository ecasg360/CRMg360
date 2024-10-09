using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectContactService : Repository<ProjectContact>, IProjectContactService
    {
        public ProjectContactService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ProjectContact GetProjectContact(int id)
        {
            DbCommand cmd = LoadCmd("GetProjectContact");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public ProjectContact GetProjectContactByDetail(int projectId, int personId)
        {
            DbCommand cmd = LoadCmd("GetProjectContactByDetail");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd).First();
        }

        public void CreateProjectContact(ProjectContact projectContact) =>
        Add(projectContact);

        public void CreateProjectContacts(List<ProjectContact> projectContacts) =>
        AddRange(projectContacts);

        public void UpdateProjectContact(ProjectContact projectContact) =>
        Update(projectContact, projectContact.Id);

        public void DeleteProjectContact(ProjectContact projectContact) =>
        Delete(projectContact);

    }
}
