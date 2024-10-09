using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAirlineService
    {
        IEnumerable<AirLine> GetAllAirlines();
    }
}
