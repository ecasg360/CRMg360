using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IProjectArtistService
    {
        IEnumerable<ProjectArtist> Create(List<ProjectArtist> projectArtists);
        IEnumerable<ProjectArtist> GetByProject(int projectId);
        ProjectArtist Get(int id);
        ProjectArtist GetByArtistId(int artistId);
        void Delete(IEnumerable<ProjectArtist> projectArtists);
        void Delete(ProjectArtist projectArtist);
    }
}
