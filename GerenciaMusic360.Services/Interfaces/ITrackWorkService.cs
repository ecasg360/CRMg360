using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITrackWorkService
    {
        IEnumerable<TrackWork> GetAll();
        IEnumerable<TrackWork> GetAllByTrack(int trackId);
        IEnumerable<TrackWork> GetAllTrackWork();
        TrackWork Get(int id);
        TrackWork Create(TrackWork work);
        void Update(TrackWork work);
        void Delete(TrackWork work);
    }
}
