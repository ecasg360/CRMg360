using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class LanguageService : Repository<Language>, ILanguageService
    {
        public LanguageService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Language> GetAllLanguage() =>
        GetAll();
    }
}
