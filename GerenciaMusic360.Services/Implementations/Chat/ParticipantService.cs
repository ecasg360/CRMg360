using GerenciaMusic360.Data;
using GerenciaMusic360.Entities.Models.Chats;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces.Chats;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations.Chat
{
    public class ParticipantService : Repository<ChatParticipantViewModel>, IParticipantService
    {
        public ParticipantService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }
        public IEnumerable<ParticipantResponseViewModel> GetAllParticipantChat(string userId)
        {
            DbCommand cmd = LoadCmd("GetAllParticipantChat");
            cmd = AddParameter(cmd, "UserId", userId);
            var chatParticipants = ExecuteReader(cmd).ToList();
            var participantResponses = chatParticipants.Select(a => new ParticipantResponseViewModel { Participant = a, Metadata = new ParticipantMetadataViewModel { TotalUnreadMessages = a.TotalUnreadMessages } }).ToList();
            return participantResponses;
        }

        public bool UpdateStatusParticipantChat(string userId, int status)
        {
            try
            {
                DbCommand cmd = LoadCmd("UpdateStatusParticipantChat");
                cmd = AddParameter(cmd, "UserId", userId);
                cmd = AddParameter(cmd, "Status", status);
                var result = ExecuteReader(cmd);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
