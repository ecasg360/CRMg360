using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITypeService
    {
        IEnumerable<Type> GetAllTypes(int typeId);
        Type GetType(int id, int typeId);
        Type CreateType(Type type, string user);
        void UpdateType(Type type, string user);
        void UpdateStatusType(Type type, string user);
    }
}
