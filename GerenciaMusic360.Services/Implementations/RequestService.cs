using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class RequestService : Repository<Request>, IRequestService
    {
        public RequestService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public Request CreateRequest(Request request) =>
        Add(request);

        public Request GetRequest(int id)
        {
            DbCommand cmd = LoadCmd("GetRequest");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<Request> GetRequests()
        {
            DbCommand cmd = LoadCmd("GetRequests");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Request> GetRequestsByModule(int moduleId)
        {
            DbCommand cmd = LoadCmd("GetRequestsByModule");
            cmd = AddParameter(cmd, "ModuleId", moduleId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Request> GetRequestsByTask(int taskId)
        {
            DbCommand cmd = LoadCmd("GetRequestsByTask");
            cmd = AddParameter(cmd, "TaskId", taskId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Request> GetRequestsByModuleTask(int moduleId, int taskId)
        {
            DbCommand cmd = LoadCmd("GetRequestsByModuleTask");
            cmd = AddParameter(cmd, "ModuleId", moduleId);
            cmd = AddParameter(cmd, "TaskId", taskId);
            return ExecuteReader(cmd);
        }

        public void UpdateRequest(Request request) =>
        Update(request, request.Id);
    }
}
