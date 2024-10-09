using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITermsService
    {
        IEnumerable<Terms> GetAllTerms();

        IEnumerable<Terms> GetAllTerms(short termTypeId);
        Terms Get(int id);
        Terms Create(Terms terms);
        void Update(Terms terms);

    }
}
