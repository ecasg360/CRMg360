using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IGoalService
    {
        IEnumerable<Goal> GetAll();
        Goal Get(int id);
        Goal Create(Goal goal);
        Goal Update(Goal goal);
    }
}
