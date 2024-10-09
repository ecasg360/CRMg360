using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MenuService : Repository<Menu>, IMenuService
    {
        public MenuService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(Menu menu)
        {
            this.Add(menu);
        }

        public void DeleteMenu(Menu menu)
        {
            this.Delete(menu);
        }

        public IEnumerable<Menu> GetList()
        {
            return this.GetAll();
        }

        public Menu Get(string id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(Menu menu)
        {
            this.Update(menu, menu.Id);
        }
    }
}
