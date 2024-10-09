using System;

namespace GerenciaMusic360.Entities
{
    public partial class MailDispatcher
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public bool Status { get; set; }
        public int NotificationId { get; set; }
        public DateTime Created { get; set; }
        public string HtmlBody { get; set; }
        public string Subject { get; set; }
    }
}
