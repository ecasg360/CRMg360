using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonMusicalGenreService : Repository<PersonMusicalGenre>, IPersonMusicalGenreService
    {
        public PersonMusicalGenreService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonMusicalGenre> GetPersonMusicalGenreByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalGenreByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public PersonMusicalGenre GetPersonMusicalGenreByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalGenreByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public PersonMusicalGenre GetPersonMusicalGenre(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonMusicalGenre");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void CreatePersonMusicalGenre(PersonMusicalGenre personMusicalGenre) =>
        Add(personMusicalGenre);

        public void CreatePersonMusicalGenres(List<PersonMusicalGenre> personMusicalGenre) =>
        AddRange(personMusicalGenre);

        public void UpdatePersonMusicalGenre(PersonMusicalGenre personMusicalGenre) =>
        Update(personMusicalGenre, personMusicalGenre.Id);

        public void DeletePersonMusicalGenre(PersonMusicalGenre personMusicalGenre) =>
        Delete(personMusicalGenre);

        public void DeletePersonMusicalGenres(List<PersonMusicalGenre> personMusicalGenres) =>
        DeleteRange(personMusicalGenres);
    }
}
