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
    public class TrackWorkService : Repository<TrackWork>, ITrackWorkService
    {
        public TrackWorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<TrackWork> GetAll()
        {
            return GetAll();
        }

        public IEnumerable<TrackWork> GetAllTrackWork()
        {
            DbCommand cmd = LoadCmd("GetAllTrackWork");
            return ExecuteReader(cmd);
        }

        public IEnumerable<TrackWork> GetAllByTrack(int trackId)
        {
            return FindAll(w => w.TrackId == trackId);
        }

        public TrackWork Get(int id)
        {
            return Find(x => x.Id == id);
        }

        public TrackWork Create(TrackWork TrackWork) =>
        Add(TrackWork);

        public void Update(TrackWork TrackWork) =>
        Update(TrackWork, TrackWork.Id);

        public void Delete(TrackWork TrackWork) =>
        Delete(TrackWork);
    }
}
