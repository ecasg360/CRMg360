using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class FieldValueService : Repository<FieldValue>, IFieldValueService
    {
        public FieldValueService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public FieldValue GetFieldValue(long id) =>
        Find(w => w.Id == id);

        public FieldValue GetFieldValue(long id, int contractId) =>
        Find(w => w.FieldId == id & w.DocumentId == contractId);

        public FieldValue CreateFieldValue(FieldValue FieldValue) =>
        Add(FieldValue);

        public void UpdateFieldValue(FieldValue FieldValue) =>
        Update(FieldValue, FieldValue.Id);

        public void DeleteFieldValue(FieldValue FieldValue) =>
        Delete(FieldValue);
    }
}
