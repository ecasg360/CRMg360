using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IDepartmentService
    {
        IEnumerable<Department> GetList();
        Department Get(int id);
        void Create(Department model);
        void Update(Department model);
        void Delete(Department model);
    }
}
