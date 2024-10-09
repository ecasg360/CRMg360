using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonSocialNetworkService : Repository<PersonSocialNetwork>, IPersonSocialNetworkService
    {
        public PersonSocialNetworkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonSocialNetwork> GetPersonSocialNetworksByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetPersonSocialNetworkByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public PersonSocialNetwork GetPersonSocialNetworkByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonSocialNetworkByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public PersonSocialNetwork GetPersonSocialNetwork(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonSocialNetwork");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePersonSocialNetwork(PersonSocialNetwork personSocialNetwork) =>
        Add(personSocialNetwork);

        public void CreatePersonSocialNetworks(List<PersonSocialNetwork> personSocialNetworks) =>
        AddRange(personSocialNetworks);

        public void UpdatePersonSocialNetwork(PersonSocialNetwork personSocialNetwork) =>
        Update(personSocialNetwork, personSocialNetwork.Id);
    }
}
