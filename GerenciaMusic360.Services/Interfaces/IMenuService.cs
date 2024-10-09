using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMenuService
    {
        IEnumerable<Menu> GetList();
        Menu Get(string id);
        void Create(Menu menu);
        void Update(Menu menu);
        void DeleteMenu(Menu menu);
    }
}
