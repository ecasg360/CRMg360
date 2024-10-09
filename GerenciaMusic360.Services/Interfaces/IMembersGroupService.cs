using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMembersGroupService
    {

        IEnumerable<MembersGroup> GetAll();
        MembersGroup Get(int id);
        void Create(MembersGroup memberGrup);
        void Update(MembersGroup memberGrup);
        void Delete(MembersGroup memberGrup);
    }
}
