using GerenciaMusic360.Entities.Models.Chats;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces.Chats
{
    public interface IMessageService
    {
        IEnumerable<MessageViewModel> GetMessageHistory(string fromId, string toId);
        MessageViewModel Create(MessageViewModel message);
    }
}
