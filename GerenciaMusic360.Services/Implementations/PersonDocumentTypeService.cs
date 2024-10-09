using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonDocumentTypeService : Repository<PersonDocumentType>, IPersonDocumentTypeService
    {
        public PersonDocumentTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonDocumentType> GetAllPersonDocumentTypes()
        {
            DbCommand cmd = LoadCmd("GetAllPersonDocumentTypes");
            return ExecuteReader(cmd);
        }

        public PersonDocumentType GetPersonDocumentType(short id)
        {
            DbCommand cmd = LoadCmd("GetPersonDocumentType");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }
    }
}
