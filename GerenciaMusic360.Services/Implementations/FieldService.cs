using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class FieldService : Repository<Field>, IFieldService
    {
        public FieldService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Field> GetAllFields()
        {
            DbCommand cmd = LoadCmd("GetAllFields");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Field> GetAllFieldsByModule(int moduleId, int moduleTypeId, int documentId)
        {
            DbCommand cmd = LoadCmd("GetAllFieldsByModule");
            cmd = AddParameter(cmd, "@ModuleId", moduleId);
            cmd = AddParameter(cmd, "@ModuleTypeId", moduleTypeId);
            cmd = AddParameter(cmd, "@DocumentId", documentId);
            return ExecuteReader(cmd);
        }

        public Field GetField(int id) =>
        Find(w => w.Id == id);

        public Field CreateField(Field Field) =>
        Add(Field);

        public void UpdateField(Field Field) =>
        Update(Field, Field.Id);

        public void DeleteField(Field Field) =>
        Delete(Field);
    }
}
