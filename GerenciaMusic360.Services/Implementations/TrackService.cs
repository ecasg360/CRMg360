using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class TrackService : Repository<Track>, ITrackService
    {
        public TrackService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Track> GetAll()
        {
            return FindAll(w => w.StatusRecordId == 1);
        }

        public IEnumerable<Track> GetAllByWork(int workId)
        {
            DbCommand cmd = LoadCmd("GetAllTracksByWork");
            cmd = AddParameter(cmd, "WorkId", workId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Track> GetAllByProject(int projectId)
        {
            DbCommand cmd = LoadCmd("GetAllTracksByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }

        public Track GetAllByProjectAndWork(int projectId, int workId)
        {
            return Find(w => w.ProjectId == projectId && w.WorkId == workId);
        }

        public Track Get(int id)
        {
            return Find(x => x.Id == id);
        }

        public Track Create(Track Track) =>
        Add(Track);

        public void Update(Track Track) =>
        Update(Track, Track.Id);

        public void Delete(Track Track) =>
        Delete(Track);
    }
}
