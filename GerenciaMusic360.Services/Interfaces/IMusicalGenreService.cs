using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMusicalGenreService
    {
        IEnumerable<MusicalGenre> GetAll();
        MusicalGenre Get(int id);
        void Create(MusicalGenre artistType);
        void Update(MusicalGenre artistType);
        void Delete(MusicalGenre artistType);
    }
}
