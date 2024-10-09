using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ContactsSponsorService : Repository<ContactsSponsor>, IContactsSponsorService
    {
        public ContactsSponsorService(Context_DB context_DB) : base(context_DB)
        {
        }
        void IContactsSponsorService.Create(ContactsSponsor contactsSponsor) => Add(contactsSponsor);
        void IContactsSponsorService.Delete(ContactsSponsor contactsSponsor) => Delete(contactsSponsor);
        ContactsSponsor IContactsSponsorService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetContactsSponsor");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }
        IEnumerable<ContactsSponsor> IContactsSponsorService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetAllContactsSponsors");
            return ExecuteReader(cmd);
        }
        void IContactsSponsorService.Update(ContactsSponsor contactsSponsor) => Update(contactsSponsor, contactsSponsor.Id);

    }
}
