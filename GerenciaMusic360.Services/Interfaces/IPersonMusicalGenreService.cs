using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonMusicalGenreService
    {
        IEnumerable<PersonMusicalGenre> GetPersonMusicalGenreByPerson(int personId);
        PersonMusicalGenre GetPersonMusicalGenreByType(int personId, int typeId);
        PersonMusicalGenre GetPersonMusicalGenre(int id);
        void CreatePersonMusicalGenre(PersonMusicalGenre personMusicalGenre);
        void CreatePersonMusicalGenres(List<PersonMusicalGenre> personMusicalGenre);
        void UpdatePersonMusicalGenre(PersonMusicalGenre personMusicalGenre);
        void DeletePersonMusicalGenre(PersonMusicalGenre personMusicalGenre);
        void DeletePersonMusicalGenres(List<PersonMusicalGenre> personMusicalGenres);
    }
}
