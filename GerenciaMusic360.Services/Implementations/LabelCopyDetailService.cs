using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations
{
    public class LabelCopyDetailService : Repository<LabelCopyDetail>, ILabelCopyDetailService
    {
        public LabelCopyDetailService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<LabelCopyDetail> Get(int projectId)
        {
            DbCommand cmd = LoadCmd("GetLabelCopyDetail");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            
            return ExecuteReader(cmd);
        }
    }
}
