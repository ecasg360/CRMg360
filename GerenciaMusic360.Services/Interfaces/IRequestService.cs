using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IRequestService
    {
        IEnumerable<Request> GetRequests();
        IEnumerable<Request> GetRequestsByTask(int taskId);
        IEnumerable<Request> GetRequestsByModule(int moduleId);
        IEnumerable<Request> GetRequestsByModuleTask(int moduleId, int taskId);
        Request GetRequest(int id);
        Request CreateRequest(Request request);
        void UpdateRequest(Request request);
    }
}
