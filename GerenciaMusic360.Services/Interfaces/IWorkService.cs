using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IWorkService
    {
        IEnumerable<Work> GetAllWorksbyPerson(int personId);
        IEnumerable<Work> GetAllWorksbyAlbum(int albumId);
        IEnumerable<Work> GetAllWorks();
        IEnumerable<Work> GetAllWorksRelation();
        Work GetWork(int id);
        Work GetWorkRelation(int id);
        Work CreateWork(Work work);
        void UpdateWork(Work work);
        void DeleteWork(Work work);
    }
}
