using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPublisherService
    {
        Publisher SavePublisher(Publisher entity);
        Publisher UpdatePublisher(Publisher entity);
        Publisher GetPublisher(int Id);
        IEnumerable<Publisher> GetPublishers();
        void DeletePublisher(Publisher entity);
        IEnumerable<Publisher> GetPublishersRaw();
        IEnumerable<Publisher> getPublishersWithAssociation();
    }
}
