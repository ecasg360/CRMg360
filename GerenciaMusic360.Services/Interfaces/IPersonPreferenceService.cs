using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonPreferenceService
    {
        IEnumerable<PersonPreference> GetPersonPreferencesByPerson(int personId);
        PersonPreference GetPersonPreferenceByType(int personId, int typeId);
        PersonPreference GetPersonPreference(int id);
        void CreatePersonPreference(PersonPreference personPreference);
        void CreatePersonPreferences(List<PersonPreference> personPreference);
        void UpdatePersonPreference(PersonPreference personPreference);
        void DeletePersonPreference(PersonPreference personPreference);
        void DeletePersonPreferences(List<PersonPreference> personPreferences);
    }
}
