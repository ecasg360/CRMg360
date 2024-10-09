namespace GerenciaMusic360.Entities.Models
{
    public class MailConfig
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Display { get; set; }
        public bool EnableSSL { get; set; }
    }
}
