using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class CurrencyService : Repository<Currency>, ICurrencyService
    {
        public CurrencyService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(Currency currency)
        {
            this.Add(currency);
        }

        public void DeleteProjectType(Currency currency)
        {
            this.Delete(currency);
        }

        public IEnumerable<Currency> GetList()
        {
            return this.GetAll("Country").Where(x => x.StatusRecordId != 3);
        }

        public Currency Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(Currency currency)
        {
            this.Update(currency, currency.Id);
        }
    }
}
