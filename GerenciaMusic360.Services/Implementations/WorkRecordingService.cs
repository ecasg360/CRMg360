using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class WorkRecordingService : Repository<WorkRecording>, IWorkRecordingService
    {
        public WorkRecordingService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public WorkRecording CreateWorkRecording(WorkRecording workRecording) =>
        Add(workRecording);

        public IEnumerable<WorkRecording> CreateWorkRecordings(IEnumerable<WorkRecording> workRecordings) =>
        AddRange(workRecordings);

        public void DeleteWorkRecording(WorkRecording workRecording) =>
        Delete(workRecording);

        public void DeleteWorkRecordings(IEnumerable<WorkRecording> workRecordings) =>
        DeleteRange(workRecordings);

        public IEnumerable<WorkRecording> GetAllWorkRecordings(int workId) =>
        FindAll(w => w.WorkId == workId);

        public WorkRecording GetWorkRecording(int workId, int artistId) =>
        Find(w => w.WorkId == workId & w.ArtistId == artistId);

        public void UpdateWorkRecording(WorkRecording workRecording) =>
        Update(workRecording, workRecording.Id);
    }
}
