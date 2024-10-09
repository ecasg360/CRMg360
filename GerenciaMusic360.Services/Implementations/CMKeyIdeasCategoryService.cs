using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class CMKeyIdeasCategoryService : Repository<ConfigurationMarketingKeyIdeasCategory>, ICMKeyIdeasCategoryService
    {
        public CMKeyIdeasCategoryService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        IEnumerable<ConfigurationMarketingKeyIdeasCategory> ICMKeyIdeasCategoryService.GetAll() =>
        GetAll();
    }
}
