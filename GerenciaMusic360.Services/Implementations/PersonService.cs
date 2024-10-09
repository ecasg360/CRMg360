using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonService : Repository<Person>, IPersonService
    {
        public PersonService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Person> GetAllPersons(int entityId)
        {
            DbCommand cmd = LoadCmd("GetAllPersons");
            cmd = AddParameter(cmd, "EntityId", entityId);
            return ExecuteReader(cmd);
        }

        public Person GetPerson(int id)
        {
            try {
                DbCommand cmd = LoadCmd("GetPerson");
                cmd = AddParameter(cmd, "Id", id);
                return ExecuteReader(cmd).First();
            } catch (Exception e) {
                return null;
            }
            
        }

        public Person CreatePerson(Person person) =>
        Add(person);

        public IEnumerable<Person> CreatePersons(List<Person> persons) =>
        AddRange(persons);

        public void UpdatePerson(Person person) =>
        Update(person, person.Id);

        public void DeletePerson(Person person) =>
        Delete(person);

        public IEnumerable<Person> GetPersonsByRelationPerson(int personId, int entityId)
        {
            DbCommand cmd = LoadCmd("GetPersonsByRelationPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "EntityId", entityId);
            return ExecuteReader(cmd);
        }

        public Person GetMemberArtistPerson(int id)
        {
            DbCommand cmd = LoadCmd("GetMemberArtistPerson");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public Person GetAgentArtistPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetAgentArtistPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd).First();
        }
    }
}
