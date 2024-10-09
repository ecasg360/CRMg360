using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITrackService
    {
        IEnumerable<Track> GetAll();
        IEnumerable<Track> GetAllByWork(int workId);
        IEnumerable<Track> GetAllByProject(int projectId);
        Track GetAllByProjectAndWork(int projectId, int workId);
        Track Get(int id);
        Track Create(Track Track);
        void Update(Track Track);
        void Delete(Track Track);
    }
}
