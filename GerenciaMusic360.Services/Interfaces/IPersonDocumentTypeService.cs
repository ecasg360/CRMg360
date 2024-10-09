using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonDocumentTypeService
    {
        IEnumerable<PersonDocumentType> GetAllPersonDocumentTypes();
        PersonDocumentType GetPersonDocumentType(short id);
    }
}
