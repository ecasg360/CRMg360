using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectContactService
    {
        ProjectContact GetProjectContact(int id);
        ProjectContact GetProjectContactByDetail(int projectId, int personId);
        void CreateProjectContact(ProjectContact projectContact);
        void CreateProjectContacts(List<ProjectContact> projectContacts);
        void UpdateProjectContact(ProjectContact ProjectContact);
        void DeleteProjectContact(ProjectContact ProjectContact);
    }
}
