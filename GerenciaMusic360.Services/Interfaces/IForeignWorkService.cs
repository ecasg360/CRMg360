using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IForeignWorkService
    {
        IEnumerable<ForeignWork> GetAllForeignWorks();
        ForeignWork CreateForeignWork(ForeignWork foreignWork);
        IEnumerable<ForeignWork> CreateForeignWorks(List<ForeignWork> foreignWorks);
        void DeleteForeignWork(ForeignWork foreignWork);
    }
}
