using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces.Report;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations.Report
{
    public class TemplateBudgetService : Repository<TemplateBudget>, ITemplateBudgetService
    {
        public TemplateBudgetService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public TemplateBudget Get(string projectsIds)
        {
            TemplateBudget templateBudget = new TemplateBudget();

            DbCommand cmd = LoadCmd("GetBudgetTemplate");
            cmd = AddParameter(cmd, "ProjectsIds", projectsIds);
            templateBudget = ExecuteReader(cmd).First();

            return templateBudget;
        }

        public TemplateBudget GetEvents(TemplateBudget templateBudget)
        {
            DbCommand cmd = LoadCmd("GetEventsBudgetTemplate");
            cmd = AddParameter(cmd, "ProjectId", templateBudget.Id);
            templateBudget.Events = (List<BudgetEvent>)ExecuteReader(cmd);

            return templateBudget;
        }
    }
}
