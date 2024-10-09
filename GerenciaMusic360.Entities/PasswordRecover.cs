using System;

namespace GerenciaMusic360.Entities
{
    public partial class PasswordRecover
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime ExpiredDate { get; set; }
        public DateTime? RecoverDate { get; set; }
        public bool Status { get; set; }
    }
}
