using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class SponsorService : Repository<Sponsor>, ISponsorService
    {
        public SponsorService(Context_DB context_DB) : base(context_DB)
        {

        }
        void ISponsorService.Create(Sponsor sponsor) => Add(sponsor);

        void ISponsorService.Delete(Sponsor sponsor) => Delete(sponsor);

        Sponsor ISponsorService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetSponsor");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        IEnumerable<Sponsor> ISponsorService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetAllSponsors");
            return ExecuteReader(cmd);
        }

        void ISponsorService.Update(Sponsor sponsor) => Update(sponsor, sponsor.Id);
    }
}
