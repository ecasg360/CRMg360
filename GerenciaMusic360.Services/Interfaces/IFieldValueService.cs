using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IFieldValueService
    {
        FieldValue GetFieldValue(long id);
        FieldValue GetFieldValue(long id, int contractId);
        FieldValue CreateFieldValue(FieldValue file);
        void UpdateFieldValue(FieldValue file);
        void DeleteFieldValue(FieldValue file);
    }
}
