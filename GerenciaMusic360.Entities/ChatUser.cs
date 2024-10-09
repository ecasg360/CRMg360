using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class ChatUser
    {
        public string avatar { get; set; }
        public List<ChatContact> chatList { get; set; }
        public int length { get; set; }
        public string id { get; set; }
        public string mood { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}
