using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class CertificationAuthorityService : Repository<CertificationAuthority>, ICertificationAuthorityService
    {
        public CertificationAuthorityService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<CertificationAuthority> GetAllCertificationAuthorities() =>
        FindAll(w => w.StatusRecordId != 3);

        public CertificationAuthority GetCertificationAuthority(int id) =>
        Find(w => w.Id == id);

        public CertificationAuthority CreateCertificationAuthority(CertificationAuthority certificationAuthority) =>
        Add(certificationAuthority);

        public void UpdateCertificationAuthority(CertificationAuthority certificationAuthority) =>
        Update(certificationAuthority, certificationAuthority.Id);

        public void DeleteCertificationAuthority(CertificationAuthority certificationAuthority) =>
        Delete(certificationAuthority);
    }
}
