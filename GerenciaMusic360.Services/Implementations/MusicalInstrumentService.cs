using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MusicalInstrumentService : Repository<MusicalInstrument>, IMusicalInstrumentService
    {
        public MusicalInstrumentService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<MusicalInstrument> GetAllMusicalInstruments()
        {
            DbCommand cmd = LoadCmd("GetAllMusicalInstruments");
            return ExecuteReader(cmd);
        }

        public MusicalInstrument GetMusicalInstrument(int id)
        {
            DbCommand cmd = LoadCmd("GetMusicalInstrument");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreateMusicalInstrument(MusicalInstrument musicalInstrument) =>
        Add(musicalInstrument);

        public void UpdateMusicalInstrument(MusicalInstrument musicalInstrument) =>
        Update(musicalInstrument, musicalInstrument.Id);

        public void DeleteMusicalInstrument(MusicalInstrument musicalInstrument) =>
        Delete(musicalInstrument);
    }
}
