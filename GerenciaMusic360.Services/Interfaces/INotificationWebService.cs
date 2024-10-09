using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface INotificationWebService
    {
        IEnumerable<NotificationWeb> GetAll(long userId);
        NotificationWeb Get(long id);
        void Create(List<NotificationWeb> notificationWeb);
        void Update(NotificationWeb notificationWeb);
        int Count();
    }
}
