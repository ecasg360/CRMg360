using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models.Chats;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces.Chats;
using System.Collections.Generic;
using System.Data.Common;

namespace GerenciaMusic360.Services.Implementations.Chat
{
    public class MessageService : Repository<MessageViewModel>, IMessageService
    {
        public MessageService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<MessageViewModel> GetMessageHistory(string fromId, string toId)
        {
            DbCommand cmd = LoadCmd("GetMessageHistory");
            cmd = AddParameter(cmd, "fromId", fromId);
            cmd = AddParameter(cmd, "toId", toId);
            return ExecuteReader(cmd);
        }

        public MessageViewModel Create(MessageViewModel message) =>
        Add(message);
    }
}
