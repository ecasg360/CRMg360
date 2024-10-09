using System;

namespace GerenciaMusic360.Entities
{
    public class Menu
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Translate { get; set; }
        public string Type { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
        public string ParentId { get; set; }
        public int? MenuOrder { get; set; }
        public bool? Self { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string Roles { get; set; }
    }
}
