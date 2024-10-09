using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IVisaTypeService
    {
        IEnumerable<VisaType> GetAllVisaTypes();
        VisaType GetVisaType(short id);
    }
}
