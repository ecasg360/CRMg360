using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class ForeignWorkService : Repository<ForeignWork>, IForeignWorkService
    {
        public ForeignWorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {

        }

        public IEnumerable<ForeignWork> GetAllForeignWorks()
        {
            return _context.ForeignWork.Include(fwp => fwp.ForeignWorkPerson);
        }

        public ForeignWork CreateForeignWork(ForeignWork foreignWork) =>
        Add(foreignWork);

        public IEnumerable<ForeignWork> CreateForeignWorks(List<ForeignWork> foreignWorks) =>
        AddRange(foreignWorks);

        public void DeleteForeignWork(ForeignWork foreignWork) =>
        Delete(foreignWork);
    }
}
