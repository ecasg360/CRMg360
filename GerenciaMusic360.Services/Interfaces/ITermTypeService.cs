using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ITermTypeService
    {
        IEnumerable<TermType> GetAllTermTypes();
        TermType Get(int id);
        TermType Create(TermType termType);
        void Update(TermType termType);
    }
}
