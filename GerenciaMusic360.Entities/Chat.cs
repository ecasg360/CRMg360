using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class Chat
    {
        public string avatar { get; set; }
        public string id { get; set; }
        public string mood { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public string unread { get; set; }
        public List<ChatDialog> dialog { get; set; }
    }
}
