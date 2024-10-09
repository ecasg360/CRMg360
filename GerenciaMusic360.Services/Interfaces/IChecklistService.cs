using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IChecklistService
    {
        IEnumerable<Checklist> GetAllRecords();
        Checklist GetRecord(int id);
        Checklist CreateRecord(Checklist model);
        void UpdateRecord(Checklist model);
        void DeleteRecord(Checklist model);
    }
}
