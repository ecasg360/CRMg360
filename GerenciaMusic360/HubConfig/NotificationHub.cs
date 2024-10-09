using GerenciaMusic360.Entities;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.HubConfig
{
    public class NotificationHub : Hub
    {
        private static readonly List<UserHub> Users = new List<UserHub>();
        private readonly object UsersConnectionLock = new object();

        public void Send(IHubContext<NotificationHub> context, string userId, string message)
        {
            UserHub receiver = Users.Find(w => w.UserId == userId);
            if (receiver != null)
                context.Clients.Client(receiver.ConnectionId).SendAsync("ReceiveNotification", message);
        }

        public void Join(string userName)
        {
            lock (UsersConnectionLock)
            {
                string connectionId = Context.ConnectionId;

                if (userName != null)
                    Users.Add(new UserHub
                    {
                        UserId = userName,
                        ConnectionId = connectionId
                    });
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            lock (UsersConnectionLock)
            {
                string connectionId = Context.ConnectionId;

                Users.Remove(Users.FirstOrDefault(w => w.ConnectionId == connectionId));

                return base.OnDisconnectedAsync(exception);
            }
        }
    }
}
