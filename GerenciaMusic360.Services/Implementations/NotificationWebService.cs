using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class NotificationWebService : Repository<NotificationWeb>, INotificationWebService
    {
        public NotificationWebService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        void INotificationWebService.Create(List<NotificationWeb> notificationWeb) =>
        AddRange(notificationWeb);

        NotificationWeb INotificationWebService.Get(long id) =>
        Get(id);

        IEnumerable<NotificationWeb> INotificationWebService.GetAll(long userId) =>
        FindAll(w => w.UserId == userId & w.Active);

        void INotificationWebService.Update(NotificationWeb notificationWeb) =>
        Update(notificationWeb, notificationWeb.Id);
    }
}
