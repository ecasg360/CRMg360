using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPreferenceService
    {
        IEnumerable<Preference> GetAllPreferences();
        IEnumerable<Preference> GetAllPreferencesByType(int typeId);
        Preference GetPreference(int id);
        void CreatePreference(Preference preference);
        void UpdatePreference(Preference preference);
    }
}
