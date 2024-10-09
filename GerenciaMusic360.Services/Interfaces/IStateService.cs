using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IStateService
    {
        IEnumerable<State> GetAllStates();
        IEnumerable<State> GetStatesByCountry(int countryId);
    }
}
