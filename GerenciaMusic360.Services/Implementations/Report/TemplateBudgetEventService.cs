using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Report;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces.Report;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations.Report
{
    public class TemplateBudgetEventService : Repository<BudgetEvent>, ITemplateBudgetEventService
    {
        public TemplateBudgetEventService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
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
