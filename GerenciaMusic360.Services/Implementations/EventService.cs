using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class EventService : Repository<BudgetEvent>, IEventService
    {
        public EventService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<BudgetEvent> GetEventsByArtist(int artistId, int projectTypeId, int projectId)
        {
            DbCommand cmd = LoadCmd("GetEventsByArtist");
            cmd = AddParameter(cmd, "ArtistId", artistId);
            cmd = AddParameter(cmd, "ProjectTypeId", projectTypeId);
            cmd = AddParameter(cmd, "ProjectId", projectId);
            return ExecuteReader(cmd);
        }
    }
}
