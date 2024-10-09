using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ILocationService
    {
        IEnumerable<Location> GetList();
        Location Get(int id);
        void Create(Location location);
        Location CreateLocation(Location location);
        void Update(Location location);
        void DeleteLocation(Location location);
    }
}
