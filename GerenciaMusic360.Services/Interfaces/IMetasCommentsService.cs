using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMetasCommentsService
    {
        IEnumerable<MetasComments> GetCommentsByMetaId(int metaId);
        MetasComments CreateRecord(MetasComments model);
    }
}
