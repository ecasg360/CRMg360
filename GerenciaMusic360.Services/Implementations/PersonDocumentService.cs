using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonDocumentService : Repository<PersonDocument>, IPersonDocumentService
    {
        public PersonDocumentService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonDocument> GetPersonDocumentByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetPersonDocumentByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public PersonDocument GetPersonDocumentByType(int personId, short typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonDocumentByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public PersonDocument GetPersonDocument(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonDocument");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePersonDocument(PersonDocument personDocument) =>
        Add(personDocument);

        public void CreatePersonDocuments(List<PersonDocument> personDocument) =>
        AddRange(personDocument);

        public void UpdatePersonDocument(PersonDocument personDocument) =>
        Update(personDocument, personDocument.Id);
    }
}
