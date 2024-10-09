using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IContactsSponsorService
    {
        IEnumerable<ContactsSponsor> GetAll();
        ContactsSponsor Get(int id);
        void Create(ContactsSponsor sponsor);
        void Update(ContactsSponsor sponsor);
        void Delete(ContactsSponsor sponsor);
    }
}
