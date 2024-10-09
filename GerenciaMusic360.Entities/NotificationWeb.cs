using System;

namespace GerenciaMusic360.Entities
{
    public partial class NotificationWeb
    {
        public long Id { get; set; }
        public string Message { get; set; }
        public bool Active { get; set; }
        public long? UserId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public long? TaskId { get; set;  }
    }
}
