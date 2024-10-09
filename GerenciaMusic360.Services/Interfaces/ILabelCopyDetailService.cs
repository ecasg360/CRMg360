using GerenciaMusic360.Entities.Models;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ILabelCopyDetailService
    {
        IEnumerable<LabelCopyDetail> Get(int projectId);
    }
}
