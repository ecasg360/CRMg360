using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class ActivitiesProjectReportsService :  Repository<ProjectTask>, IActivitiesProjectReports
    {
        public ActivitiesProjectReportsService(Context_DB context) : base(context)
        {
        }

        public IEnumerable<ProjectTask> GetActivesProjectTaskByUser(int userId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskActiveByUser");
            cmd = AddParameter(cmd, "userId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<ProjectTask> GetProjectTaskByUser(int userId)
        {
            DbCommand cmd = LoadCmd("GetProjectTaskByUser");
            cmd = AddParameter(cmd, "userId", userId);
            return ExecuteReader(cmd);
        }
    }
}
