using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class GoalService : Repository<Goal>, IGoalService
    {
        public GoalService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        Goal IGoalService.Create(Goal goal) =>
        Add(goal);

        Goal IGoalService.Get(int id) =>
        Get(id);

        IEnumerable<Goal> IGoalService.GetAll() =>
        FindAll(w => w.Active);

        Goal IGoalService.Update(Goal goal) =>
        Update(goal, goal.Id);
    }
}
