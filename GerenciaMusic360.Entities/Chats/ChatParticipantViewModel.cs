using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities.Models.Chats
{
    public class ChatParticipantViewModel
    {
        public ChatParticipantTypeEnum ParticipantType { get; set; }
        public string Id { get; set; }
        public int Status { get; set; }
        public string Avatar { get; set; }
        public string DisplayName { get; set; }
        [NotMapped]
        public int TotalUnreadMessages { get; set; }
    }
}
