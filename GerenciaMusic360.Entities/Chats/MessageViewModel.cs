using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities.Models.Chats
{
    [Table("ChatMessage")]
    public class MessageViewModel
    {
        public long Id { get; set; }
        public int Type { get; set; }
        public string FromId { get; set; }
        public string ToId { get; set; }
        public string Message { get; set; }
        public DateTime? DateSent { get; set; }
        public DateTime? DateSeen { get; set; }
        [NotMapped]
        public string DownloadUrl { get; set; }
        [NotMapped]
        public int? FileSizeInBytes { get; set; }
    }
}
