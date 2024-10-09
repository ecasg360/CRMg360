using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonPreferenceService : Repository<PersonPreference>, IPersonPreferenceService
    {
        public PersonPreferenceService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonPreference> GetPersonPreferencesByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetPersonPreferenceByPersonMod");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public PersonPreference GetPersonPreferenceByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonPreferenceByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public PersonPreference GetPersonPreference(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonPreference");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePersonPreference(PersonPreference personPreference) =>
        Add(personPreference);

        public void CreatePersonPreferences(List<PersonPreference> personPreferences) =>
        AddRange(personPreferences);

        public void UpdatePersonPreference(PersonPreference personPreference) =>
        Update(personPreference, personPreference.Id);

        public void DeletePersonPreference(PersonPreference personPreference) =>
        Delete(personPreference);

        public void DeletePersonPreferences(List<PersonPreference> personPreferences) =>
        DeleteRange(personPreferences);
    }
}