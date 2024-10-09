using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models.Chats
{
    public class GroupChatParticipantViewModel : ChatParticipantViewModel
    {
        public IList<ChatParticipantViewModel> ChattingTo { get; set; }
    }
}
