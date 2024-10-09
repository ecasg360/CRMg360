using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IForeignWorkPersonService
    {
        ForeignWorkPerson GetForeignWorkPerson(int id);
        void CreateForeignWorkPerson(ForeignWorkPerson foreignWorkPerson);
        void CreateForeignWorkPersons(List<ForeignWorkPerson> foreignWorkPersons);
        void DeleteForeignWorkPerson(ForeignWorkPerson foreignWorkPerson);
    }
}
