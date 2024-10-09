using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonService
    {
        IEnumerable<Person> GetAllPersons(int entityId);
        Person GetPerson(int id);
        Person CreatePerson(Person person);
        IEnumerable<Person> CreatePersons(List<Person> persons);
        void UpdatePerson(Person person);
        void DeletePerson(Person person);
        IEnumerable<Person> GetPersonsByRelationPerson(int personId, int entityId);
        Person GetMemberArtistPerson(int id);
        Person GetAgentArtistPerson(int personId);

    }
}
