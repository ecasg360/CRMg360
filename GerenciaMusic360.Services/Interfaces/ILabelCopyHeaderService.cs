using GerenciaMusic360.Entities.Models;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ILabelCopyHeaderService
    {
        LabelCopyHeader Get(int projectId);
    }
}
