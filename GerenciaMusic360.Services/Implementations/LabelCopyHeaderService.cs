using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class LabelCopyHeaderService : Repository<LabelCopyHeader>, ILabelCopyHeaderService
    {
        public LabelCopyHeaderService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public LabelCopyHeader Get(int projectId)
        {
            DbCommand cmd = LoadCmd("GetLabelCopyHeader");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            LabelCopyHeader result = ExecuteReader(cmd).First();
            return result ?? new LabelCopyHeader();
        }
    }
}
