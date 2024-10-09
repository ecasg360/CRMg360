using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class TermTypeService : Repository<TermType>, ITermTypeService
    {
        public TermTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<TermType> GetAllTermTypes()
        {
            DbCommand cmd = LoadCmd("GetAllTermTypes");
            return ExecuteReader(cmd);
        }
        public TermType Create(TermType termType) => Add(termType);

        public TermType Get(int id) => Find(x => x.Id == id);
        public void Update(TermType termType) => Update(termType, termType.Id);
    }
}
