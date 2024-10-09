using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IGroupService
    {
        IEnumerable<Group> GetAll();
        Group Get(int id);
        void Create(Group group);
        void Update(Group group);
        void Delete(Group group);
    }
}
