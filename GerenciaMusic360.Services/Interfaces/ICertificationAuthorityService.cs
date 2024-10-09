using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICertificationAuthorityService
    {
        IEnumerable<CertificationAuthority> GetAllCertificationAuthorities();
        CertificationAuthority GetCertificationAuthority(int id);
        CertificationAuthority CreateCertificationAuthority(CertificationAuthority certificationAuthority);
        void UpdateCertificationAuthority(CertificationAuthority certificationAuthority);
        void DeleteCertificationAuthority(CertificationAuthority certificationAuthority);
    }
}
