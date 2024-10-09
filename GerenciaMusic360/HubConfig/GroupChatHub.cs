using GerenciaMusic360.Entities.Models.Chats;
using GerenciaMusic360.Services.Interfaces.Chats;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.HubConfig
{
    public class GroupChatHub : Hub
    {
        private static List<ParticipantResponseViewModel> AllConnectedParticipants { get; set; } = new List<ParticipantResponseViewModel>();
        private static List<ParticipantResponseViewModel> DisconnectedParticipants { get; set; } = new List<ParticipantResponseViewModel>();
        private static List<GroupChatParticipantViewModel> AllGroupParticipants { get; set; } = new List<GroupChatParticipantViewModel>();
        private static string ConnectionId { get; set; } = "";
        private object ParticipantsConnectionLock = new object();

        private readonly IParticipantService _participantService;

        public GroupChatHub(IParticipantService participantService)
        {
            this._participantService = participantService;
        }

        private static IEnumerable<ParticipantResponseViewModel> FilteredGroupParticipants(string currentUserId, IEnumerable<ParticipantResponseViewModel> arrayParticipants)
        {
            //var lstResult = this._participantService.GetAllParticipantChat(currentUserId);
            //return lstResult.ToArray();

            AllConnectedParticipants = arrayParticipants.ToList();
            return AllConnectedParticipants.Where(p => p.Participant.ParticipantType == ChatParticipantTypeEnum.User
                       || AllGroupParticipants.Any(g => g.Id == p.Participant.Id && g.ChattingTo.Any(u => u.Id == currentUserId))
                );
        }

        public static IEnumerable<ParticipantResponseViewModel> ConnectedParticipants(string currentUserId, IEnumerable<ParticipantResponseViewModel> arrayParticipants)
        {
            return FilteredGroupParticipants(currentUserId, arrayParticipants).Where(x => x.Participant.Id != currentUserId);
        }

        public void Join(string userName, string userId)
        {
            lock (ParticipantsConnectionLock)
            {

                AllConnectedParticipants.Add(new ParticipantResponseViewModel()
                {
                    Metadata = new ParticipantMetadataViewModel()
                    {
                        TotalUnreadMessages = 0
                    },
                    Participant = new ChatParticipantViewModel()
                    {
                        DisplayName = userName,
                        Id = userId
                    }
                });

                ConnectionId = userId;
                // This will be used as the user's unique ID to be used on ng-chat as the connected user.
                // You should most likely use another ID on your application
                Clients.Caller.SendAsync("generatedUserId", userId);

                Clients.All.SendAsync("friendsListChanged", AllConnectedParticipants);
            }
        }

        public void GroupCreated(GroupChatParticipantViewModel group)
        {
            AllGroupParticipants.Add(group);

            // Pushing the current user to the "chatting to" list to keep track of who's created the group as well.
            // In your application you'll probably want a more sofisticated group persistency and management
            group.ChattingTo.Add(new ChatParticipantViewModel()
            {
                Id = ConnectionId
            });

            AllConnectedParticipants.Add(new ParticipantResponseViewModel()
            {
                Metadata = new ParticipantMetadataViewModel()
                {
                    TotalUnreadMessages = 0
                },
                Participant = group
            });

            Clients.All.SendAsync("friendsListChanged", AllConnectedParticipants);
        }

        public void SendMessage(MessageViewModel message)
        {
            var sender = AllConnectedParticipants.Where(x => x.Participant.Id == message.FromId).Single();

            if (sender != null)
            {
                var groupDestinatary = AllGroupParticipants.Where(x => x.Id == message.ToId).FirstOrDefault();

                if (groupDestinatary != null)
                {
                    // Notify all users in the group except the sender
                    var usersInGroupToNotify = AllConnectedParticipants
                                               .Where(p => p.Participant.Id != sender.Participant.Id
                                                      && groupDestinatary.ChattingTo.Any(g => g.Id == p.Participant.Id)
                                               )
                                               .Select(g => g.Participant.Id);

                    Clients.Clients(usersInGroupToNotify.ToList()).SendAsync("messageReceived", groupDestinatary, message);
                }
                else
                {
                    var a = Clients.Clients(message.FromId);
                    Clients.All.SendAsync("messageReceived", sender.Participant, message);
                }
            }
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            lock (ParticipantsConnectionLock)
            {
                var connectionIndex = AllConnectedParticipants.FindIndex(x => x.Participant.Id == ConnectionId);

                if (connectionIndex >= 0)
                {
                    var participant = AllConnectedParticipants.ElementAt(connectionIndex);

                    var groupsParticipantIsIn = AllGroupParticipants.Where(x => x.ChattingTo.Any(u => u.Id == participant.Participant.Id));

                    AllConnectedParticipants.RemoveAll(x => groupsParticipantIsIn.Any(g => g.Id == x.Participant.Id));
                    AllGroupParticipants.RemoveAll(x => groupsParticipantIsIn.Any(g => g.Id == x.Id));

                    AllConnectedParticipants.Remove(participant);
                    DisconnectedParticipants.Add(participant);

                    Clients.All.SendAsync("friendsListChanged", AllConnectedParticipants);
                }

                return base.OnDisconnectedAsync(exception);
            }
        }

        public override Task OnConnectedAsync()
        {
            lock (ParticipantsConnectionLock)
            {
                var connectionIndex = DisconnectedParticipants.FindIndex(x => x.Participant.Id == ConnectionId);

                if (connectionIndex >= 0)
                {
                    var participant = DisconnectedParticipants.ElementAt(connectionIndex);

                    DisconnectedParticipants.Remove(participant);
                    AllConnectedParticipants.Add(participant);

                    Clients.All.SendAsync("friendsListChanged", AllConnectedParticipants);
                }

                return base.OnConnectedAsync();
            }
        }
    }
}
