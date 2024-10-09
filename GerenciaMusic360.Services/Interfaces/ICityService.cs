using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICityService
    {
        IEnumerable<City> GetAllCities();
        IEnumerable<City> GetCitiesByState(int stateId);
    }
}
