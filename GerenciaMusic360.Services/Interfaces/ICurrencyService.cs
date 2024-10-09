using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICurrencyService
    {
        IEnumerable<Currency> GetList();
        Currency Get(int id);
        void Create(Currency projectType);
        void Update(Currency projectType);
        void Delete(Currency projectType);
    }
}
