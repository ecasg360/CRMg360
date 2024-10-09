using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IActivitiesProjectReports
    {

        IEnumerable<ProjectTask> GetProjectTaskByUser(int userId);
        IEnumerable<ProjectTask> GetActivesProjectTaskByUser(int userId);

    }
}
