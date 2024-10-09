using GerenciaMusic360.Entities.Report;

namespace GerenciaMusic360.Services.Interfaces.Report
{
    public interface ITemplateBudgetService
    {
        TemplateBudget Get(string projectId);
    }
}
