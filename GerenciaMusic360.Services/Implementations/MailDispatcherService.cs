
using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Implementations
{
    public class MailDispatcherService : Repository<MailDispatcher>, IMailDispatcherService
    {
        public MailDispatcherService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreateMailDispatchers(
            Common.Enum.NotificationType notificationType,
            List<UserNotificationModel> recipients,
            Notification notification,
            List<ReplaceModel> replaces)
        {
            List<MailDispatcher> notifications = new List<MailDispatcher>();
            foreach (UserNotificationModel recipient in recipients)
            {

                notifications.Add(new MailDispatcher
                {
                    Email = recipient.Email,
                    NotificationId = (int)notificationType,
                    Status = false,
                    Subject = notification.Subject,
                    Created = DateTime.Now,
                    HtmlBody = ReplaceTag(notification.HtmlBody, replaces)
                });
            }

            AddRange(notifications);
        }

        public string ReplaceTag(string HtmlBody, List<ReplaceModel> replaces)
        {
            replaces.ForEach(f => HtmlBody = HtmlBody.Replace($"#{f.Key}#", f.Value));
            return HtmlBody;
        }
    }
}
