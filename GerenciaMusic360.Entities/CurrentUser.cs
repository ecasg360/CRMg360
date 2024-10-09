
namespace GerenciaMusic360.Entities
{
    public class CurrentUser
    {
        public string Id { get; set; }
        public string AuthToken { get; set; }
        public int ExpiresIn { get; set; }
        public long UserId { get; set; }
    }
}
