using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IWorkRecordingService
    {
        IEnumerable<WorkRecording> GetAllWorkRecordings(int workId);
        WorkRecording GetWorkRecording(int workId, int artistId);
        WorkRecording CreateWorkRecording(WorkRecording workRecording);
        IEnumerable<WorkRecording> CreateWorkRecordings(IEnumerable<WorkRecording> workRecordings);
        void UpdateWorkRecording(WorkRecording workRecording);
        void DeleteWorkRecording(WorkRecording workRecording);
        void DeleteWorkRecordings(IEnumerable<WorkRecording> workRecordings);
    }
}
