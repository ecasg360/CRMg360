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
    public class MetasCommentsService : Repository<MetasComments>, IMetasCommentsService
    {
        public MetasCommentsService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<MetasComments> GetCommentsByMetaId(int metaId)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetMetasCommentsByMetaId");
                cmd = AddParameter(cmd, "MetaId", metaId);
                return ExecuteReader(cmd);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public MetasComments CreateRecord(MetasComments model) =>
        Add(model);
    }
}
