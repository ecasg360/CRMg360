using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class WorkService : Repository<Work>, IWorkService
    {
        public WorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Work> GetAllWorks()
        {
            return FindAll(w => w.StatusRecordId == 1);
            //DbCommand cmd = LoadCmd("GetAllWorks");
            //return ExecuteReader(cmd);
        }

        public IEnumerable<Work> GetAllWorksRelation()
        {
            return _context.Work.Include(x => x.WorkCollaborator).ThenInclude(a => (a as WorkCollaborator).Association)
                .Include(x => x.WorkCollaborator).ThenInclude(r => (r as WorkCollaborator).Composer)
                .Include(x=> x.WorkPublisher).ThenInclude(r => (r as WorkPublisher).Publisher)
                .Include(x => x.WorkPublisher).ThenInclude(r => (r as WorkPublisher).Association)
                .Where(w => w.StatusRecordId < 3).ToList();
        }

        public IEnumerable<Work> GetAllWorksbyPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetAllWorksByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }
        public IEnumerable<Work> GetAllWorksbyAlbum(int albumId)
        {
            DbCommand cmd = LoadCmd("GetAllWorksByAlbum");
            cmd = AddParameter(cmd, "AlbumId", albumId);
            return ExecuteReader(cmd);
        }

        public Work GetWork(int id)
        {
            DbCommand cmd = LoadCmd("GetWork");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public Work CreateWork(Work work) =>
        Add(work);

        public void UpdateWork(Work work) =>
        Update(work, work.Id);

        public void DeleteWork(Work work) =>
        Delete(work);

        public Work GetWorkRelation(int id)
            => _context.Work.Include(x => x.WorkCollaborator).ThenInclude(a => (a as WorkCollaborator).Association)
                .Include(x => x.WorkCollaborator).ThenInclude(r => (r as WorkCollaborator).Composer)
                .Include(x => x.WorkPublisher).ThenInclude(r => (r as WorkPublisher).Publisher)
                .Include(x => x.WorkPublisher).ThenInclude(r => (r as WorkPublisher).Association)
                .FirstOrDefault(w => w.Id == id);

    }
}
