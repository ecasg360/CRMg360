using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class FieldTypeService : Repository<FieldType>, IFieldTypeService
    {
        public FieldTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<FieldType> GetAllFieldTypes()
        {
            DbCommand cmd = LoadCmd("GetAllFieldTypes");
            return ExecuteReader(cmd);
        }

        public FieldType GetFieldType(int id) =>
        Find(w => w.Id == id);

        public FieldType CreateFieldType(FieldType fieldType) =>
        Add(fieldType);

        public void UpdateFieldType(FieldType fieldType) =>
        Update(fieldType, fieldType.Id);

        public void DeleteFieldType(FieldType fieldType) =>
        Delete(fieldType);
    }
}
