using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class TermsService : Repository<Terms>, ITermsService
    {
        public TermsService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<Terms> GetAllTerms()
        {
            DbCommand cmd = LoadCmd("GetAllTerms");
            return ExecuteReader(cmd);
        }


        public IEnumerable<Terms> GetAllTerms(short termTypeId)
        {
            var list = _context.Terms.Where(x => x.TermTypeId == termTypeId).ToList();
            return list;
        }

        public Terms Create(Terms terms) =>
            this.Add(terms);


        public Terms Get(int id)
        {
            return this.Find(x => x.Id == id);
        }
        public void Update(Terms terms)
        {
            this.Update(terms, terms.Id);
        }
    }
}
