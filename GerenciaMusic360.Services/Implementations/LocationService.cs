using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class LocationService : Repository<Location>, ILocationService
    {
        public LocationService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(Location location) => Add(location);

        public Location CreateLocation(Location location) => Add(location);

        public void DeleteLocation(Location location) => Delete(location);

        public IEnumerable<Location> GetList() => FindAll(f => f.StatusRecordId < 3, new string[] { "Address" });

        public Location Get(int id) => Find(x => x.Id == id);

        public void Update(Location location) => Update(location, location.Id);
    }
}
