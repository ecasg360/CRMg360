using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonDocumentService
    {
        IEnumerable<PersonDocument> GetPersonDocumentByPerson(int personId);
        PersonDocument GetPersonDocumentByType(int personId, short typeId);
        PersonDocument GetPersonDocument(int id);
        void CreatePersonDocument(PersonDocument personDocument);
        void CreatePersonDocuments(List<PersonDocument> personDocument);
        void UpdatePersonDocument(PersonDocument personDocument);

    }
}
