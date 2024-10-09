using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class WorkPublisherService : Repository<WorkPublisher>, IWorkPublisherService
    {
        public WorkPublisherService(Context_DB context) : base(context)
        {
        }

        public WorkPublisher CreateWorkPublisher(WorkPublisher workPublisher) => Add(workPublisher);

        public IEnumerable<WorkPublisher> CreateWorkPublishers(List<WorkPublisher> workPublishers) => AddRange(workPublishers);

        public void DeleteWorkPublisher(WorkPublisher workPublisher) => Delete(workPublisher);

        public void DeleteWorkPublishers(IEnumerable<WorkPublisher> workPublishers) => DeleteRange(workPublishers);

        public WorkPublisher GetWorkPublisher(int workId, int publisherId) => Find(w => w.WorkId == workId & w.PublisherId == publisherId);

        public IEnumerable<WorkPublisher> GetWorkPublisherByWork(int workId) => FindAll(w => w.WorkId == workId);

        public IEnumerable<WorkPublisher> GetWorkPublisherByWorkPublisher(int workId) 
            => _context.WorkPublisher.Include(r => r.Publisher).Where(x => x.WorkId == workId).ToList();

        public WorkPublisher UpdateWorkPublisher(WorkPublisher workPublisher) => Update(workPublisher, workPublisher.Id);
    }
}
