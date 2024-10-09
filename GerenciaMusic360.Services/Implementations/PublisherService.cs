using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class PublisherService : Repository<Publisher>, IPublisherService
    {
        public PublisherService(Context_DB context) : base(context)
        {
        }

        public void DeletePublisher(Publisher entity) => Delete(entity);

        public Publisher GetPublisher(int Id) => Find(f => f.Id == Id);

        public IEnumerable<Publisher> GetPublishers() => GetAll();

        public IEnumerable<Publisher> GetPublishersRaw()
        {
            DbCommand cmd = LoadCmd("GetPublishers");
            return ExecuteReader(cmd);
        }

        public Publisher SavePublisher(Publisher entity) => Add(entity);

        public Publisher UpdatePublisher(Publisher entity) => Update(entity, entity.Id);
        public IEnumerable<Publisher> getPublishersWithAssociation()
        {
            return _context.Publisher.Include(r => r.Association);
        }
    }
}
