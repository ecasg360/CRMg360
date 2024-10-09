using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class BuyerTypeService : Repository<BuyerType>, IBuyerTypeService
    {
        public BuyerTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(BuyerType entity)
        {
            this.Add(entity);
        }

        public void DeleteProjectType(BuyerType entity)
        {
            this.Delete(entity);
        }

        public IEnumerable<BuyerType> GetList()
        {
            return this.GetAll();
        }

        public BuyerType Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(BuyerType entity)
        {
            this.Update(entity, entity.Id);
        }
    }
}
