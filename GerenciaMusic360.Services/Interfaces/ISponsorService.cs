using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ISponsorService
    {
        IEnumerable<Sponsor> GetAll();
        Sponsor Get(int id);
        void Create(Sponsor sponsor);
        void Update(Sponsor sponsor);
        void Delete(Sponsor sponsor);
    }
}
