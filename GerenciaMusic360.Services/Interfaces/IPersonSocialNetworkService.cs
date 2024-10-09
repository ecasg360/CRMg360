using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonSocialNetworkService
    {
        IEnumerable<PersonSocialNetwork> GetPersonSocialNetworksByPerson(int personId);
        PersonSocialNetwork GetPersonSocialNetworkByType(int personId, int typeId);
        PersonSocialNetwork GetPersonSocialNetwork(int id);
        void CreatePersonSocialNetwork(PersonSocialNetwork personSocialNetwork);
        void CreatePersonSocialNetworks(List<PersonSocialNetwork> personSocialNetwork);
        void UpdatePersonSocialNetwork(PersonSocialNetwork personSocialNetwork);
    }
}
