using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class DepartmentService : Repository<Department>, IDepartmentService
    {
        public DepartmentService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void Create(Department model)
        {
            this.Add(model);
        }

        public void DeleteProjectType(Department model)
        {
            this.Delete(model);
        }

        public IEnumerable<Department> GetList()
        {
            return this.GetAll();
        }

        public Department Get(int id)
        {
            return this.Find(x => x.Id == id);
        }

        public void Update(Department model)
        {
            this.Update(model, model.Id);
        }
    }
}
