using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PreferenceService : Repository<Preference>, IPreferenceService
    {
        public PreferenceService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Preference> GetAllPreferences()
        {
            DbCommand cmd = LoadCmd("GetAllPreferences");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Preference> GetAllPreferencesByType(int typeId)
        {
            DbCommand cmd = LoadCmd("GetAllPreferencesByType");
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd);
        }

        public Preference GetPreference(int id)
        {
            DbCommand cmd = LoadCmd("GetPreference");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePreference(Preference preference) =>
        Add(preference);

        public void UpdatePreference(Preference preference) =>
        Update(preference, preference.Id);

    }
}
