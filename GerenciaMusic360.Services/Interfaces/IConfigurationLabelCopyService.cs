using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IConfigurationLabelCopyService
    {
        IEnumerable<ConfigurationLabelCopy> GetAll();
    }
}
