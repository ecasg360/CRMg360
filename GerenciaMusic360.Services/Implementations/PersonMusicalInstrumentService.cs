using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonMusicalInstrumentService : Repository<PersonMusicalInstrument>, IPersonMusicalInstrumentService
    {
        public PersonMusicalInstrumentService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonMusicalInstrument> GetPersonMusicalInstrumentByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalInstrumentByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public PersonMusicalInstrument GetPersonMusicalInstrumentByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalInstrumentByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public PersonMusicalInstrument GetPersonMusicalInstrument(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalInstrument");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument) =>
        Add(personMusicalInstrument);

        public void CreatePersonMusicalInstruments(List<PersonMusicalInstrument> personMusicalInstrument) =>
        AddRange(personMusicalInstrument);

        public void UpdatePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument) =>
        Update(personMusicalInstrument, personMusicalInstrument.Id);

        public void DeletePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument) =>
        Delete(personMusicalInstrument);

        public void DeletePersonMusicalInstruments(List<PersonMusicalInstrument> personMusicalInstruments) =>
        DeleteRange(personMusicalInstruments);
    }
}
