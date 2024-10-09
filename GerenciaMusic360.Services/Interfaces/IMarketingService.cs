using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMarketingService
    {
        IEnumerable<Marketing> GetAll();
        Marketing Get(int id);
        IEnumerable<Marketing> GetByLabel();
        IEnumerable<Marketing> GetByEvent();
        IEnumerable<Marketing> GetByAgency();
        Marketing Create(Marketing marketing);
        void Update(Marketing marketing);
        void Delete(Marketing marketing);
        IEnumerable<Marketing> GetByProject(int projectId);
    }
}
