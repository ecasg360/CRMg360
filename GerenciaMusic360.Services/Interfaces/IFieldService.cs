using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IFieldService
    {
        IEnumerable<Field> GetAllFields();
        IEnumerable<Field> GetAllFieldsByModule(int moduleId, int moduleTypeId, int documentId);
        Field GetField(int id);
        Field CreateField(Field file);
        void UpdateField(Field file);
        void DeleteField(Field file);
    }
}
