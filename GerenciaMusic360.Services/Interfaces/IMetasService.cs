using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IMetasService
    {
        IEnumerable<Metas> GetCurrentWeek(string InitialDate);
        IEnumerable<Metas> GetByUserAndDate(string InitialDate, int UserId);
        Metas GetRecord(int Id);
        Metas CreateRecord(Metas model);
        void UpdateRecord(Metas model);
        void DeleteRecord(Metas model);
    }
}
