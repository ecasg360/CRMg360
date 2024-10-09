using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonMusicalInstrumentService
    {
        IEnumerable<PersonMusicalInstrument> GetPersonMusicalInstrumentByPerson(int personId);
        PersonMusicalInstrument GetPersonMusicalInstrumentByType(int personId, int typeId);
        PersonMusicalInstrument GetPersonMusicalInstrument(int id);
        void CreatePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument);
        void CreatePersonMusicalInstruments(List<PersonMusicalInstrument> personMusicalInstrument);
        void UpdatePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument);
        void DeletePersonMusicalInstrument(PersonMusicalInstrument personMusicalInstrument);
        void DeletePersonMusicalInstruments(List<PersonMusicalInstrument> personMusicalInstruments);
    }
}
