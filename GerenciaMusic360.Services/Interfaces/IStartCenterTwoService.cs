using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IStartCenterTwoService
    {
        IEnumerable<StartCenterTwo> GetStartCenterTwo(int type, int year);
    }
}
