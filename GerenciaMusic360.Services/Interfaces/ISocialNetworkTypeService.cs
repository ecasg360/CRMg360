using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ISocialNetworkTypeService
    {
        IEnumerable<SocialNetworkType> GetAllSocialNetworkTypes();
        SocialNetworkType Get(int id);
        void Create(SocialNetworkType socialNetworkType);
        void Update(SocialNetworkType socialNetworkType);

    }
}
