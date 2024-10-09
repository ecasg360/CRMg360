using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IFieldTypeService
    {
        IEnumerable<FieldType> GetAllFieldTypes();
        FieldType GetFieldType(int id);
        FieldType CreateFieldType(FieldType fieldType);
        void UpdateFieldType(FieldType fieldType);
        void DeleteFieldType(FieldType fieldType);
    }
}
