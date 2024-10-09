using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class ProjectArtistService : Repository<ProjectArtist>, IProjectArtistService
    {
        public ProjectArtistService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<ProjectArtist> IProjectArtistService.Create(List<ProjectArtist> projectArtists) =>
        AddRange(projectArtists);

        void IProjectArtistService.Delete(IEnumerable<ProjectArtist> projectArtists) =>
        DeleteRange(projectArtists);

        void IProjectArtistService.Delete(ProjectArtist projectArtist) =>
        Delete(projectArtist);

        IEnumerable<ProjectArtist> IProjectArtistService.GetByProject(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectArtists");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        ProjectArtist IProjectArtistService.Get(int id) =>
        Find(w => w.Id == id);

        public ProjectArtist GetByArtistId(int artistId) => Find(f => f.GuestArtistId == artistId);
    }
}
