using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class MusicalGenreService : Repository<MusicalGenre>, IMusicalGenreService
    {
        public MusicalGenreService(Context_DB repositoryContext) : base(repositoryContext)
        {
        }
        void IMusicalGenreService.Create(MusicalGenre musicalGenre) =>
        Add(musicalGenre);

        void IMusicalGenreService.Delete(MusicalGenre musicalGenre) =>
        Delete(musicalGenre);

        MusicalGenre IMusicalGenreService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetMusicalGenre");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        IEnumerable<MusicalGenre> IMusicalGenreService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetAllMusicalGenre");
            return ExecuteReader(cmd);
        }

        void IMusicalGenreService.Update(MusicalGenre musicalGenre) =>
        Update(musicalGenre, musicalGenre.Id);

    }
}
