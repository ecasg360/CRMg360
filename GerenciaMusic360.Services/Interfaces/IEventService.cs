using GerenciaMusic360.Entities.Report;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IEventService
    {
        IEnumerable<BudgetEvent> GetEventsByArtist(int artistId, int projectTypeId, int projectId);
    }
}
