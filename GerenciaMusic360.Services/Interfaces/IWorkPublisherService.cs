using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IWorkPublisherService
    {
        IEnumerable<WorkPublisher> GetWorkPublisherByWork(int workId);
        WorkPublisher GetWorkPublisher(int workId, int publisherId);
        IEnumerable<WorkPublisher> GetWorkPublisherByWorkPublisher(int workId);
        IEnumerable<WorkPublisher> CreateWorkPublishers(List<WorkPublisher> workPublishers);
        WorkPublisher CreateWorkPublisher(WorkPublisher workPublisher);
        WorkPublisher UpdateWorkPublisher(WorkPublisher workPublisher);
        void DeleteWorkPublisher(WorkPublisher workPublisher);
        void DeleteWorkPublishers(IEnumerable<WorkPublisher> workPublishers);
    }
}
