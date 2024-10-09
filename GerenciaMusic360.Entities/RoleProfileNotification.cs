using System;

namespace GerenciaMusic360.Entities
{
    public partial class RoleProfileNotification
    {
        public int Id { get; set; }
        public int? RoleProfileId { get; set; }
        public int? NotificationId { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string RoleName { get; set; }
        public string NotificationName { get; set; }
    }
}
