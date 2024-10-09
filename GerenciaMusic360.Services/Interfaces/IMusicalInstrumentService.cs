using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMusicalInstrumentService
    {
        IEnumerable<MusicalInstrument> GetAllMusicalInstruments();
        MusicalInstrument GetMusicalInstrument(int id);
        void CreateMusicalInstrument(MusicalInstrument musicalInstrument);
        void UpdateMusicalInstrument(MusicalInstrument musicalInstrument);
        void DeleteMusicalInstrument(MusicalInstrument musicalInstrument);
    }
}
