using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class SocialNetworkTypeService : Repository<SocialNetworkType>, ISocialNetworkTypeService
    {
        public SocialNetworkTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<SocialNetworkType> GetAllSocialNetworkTypes()
        {
            DbCommand cmd = LoadCmd("GetAllSocialNetworkTypes");
            return ExecuteReader(cmd);
        }
        public void Create(SocialNetworkType socialNetworkType)
        {
            SocialNetworkType social = _context.Set<SocialNetworkType>().OrderByDescending(o => o.Id).FirstOrDefault();
            socialNetworkType.Id = social.Id+1;
            Add(socialNetworkType);
        }

        public SocialNetworkType Get(int id)
        {
            return this.Find(x => x.Id == id);
        }
        void ISocialNetworkTypeService.Update(SocialNetworkType socialNetworkType)
        {
            Update(socialNetworkType, socialNetworkType.Id);
        }
    }
}
