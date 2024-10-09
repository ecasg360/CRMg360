using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class ForeignWorkPersonService : Repository<ForeignWorkPerson>, IForeignWorkPersonService
    {
        public ForeignWorkPersonService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ForeignWorkPerson GetForeignWorkPerson(int id) =>
        Get(id);

        public void CreateForeignWorkPerson(ForeignWorkPerson foreignWorkPerson) =>
        Add(foreignWorkPerson);

        public void CreateForeignWorkPersons(List<ForeignWorkPerson> foreignWorkPersons) =>
        AddRange(foreignWorkPersons);

        public void DeleteForeignWorkPerson(ForeignWorkPerson foreignWorkPerson) =>
        Delete(foreignWorkPerson);
    }
}
