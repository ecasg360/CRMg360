using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonTypeService : Repository<PersonType>, IPersonTypeService
    {
        public PersonTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonType> GetAllPersonTypes(int entityId)
        {
            DbCommand cmd = LoadCmd("GetAllPersonTypes");
            cmd = AddParameter(cmd, "EntityId", entityId);
            return ExecuteReader(cmd);
        }

        public PersonType GetPersonType(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonType");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public PersonType GetPersonTypeNewId(int entityId)
        {
            DbCommand cmd = LoadCmd("GetPersonTypeNewId");
            cmd = AddParameter(cmd, "EntityId", entityId);
            return ExecuteReader(cmd).First();
        }

        public PersonType CreatePersonType(PersonType personType) =>
        Add(personType);

        public void UpdatePersonType(PersonType personType) =>
        Update(personType, personType.Id);

        public void DeletePersonType(PersonType personType) =>
        Delete(personType);
    }
}
