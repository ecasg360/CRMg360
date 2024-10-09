using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Request
    {
        public int Id { get; set; }
        public string Commentary { get; set; }
        public long TransmitterId { get; set; }
        public int? RequestSourceId { get; set; }
        public int? ModuleId { get; set; }
        public int? TaskId { get; set; }
        public int StatusModuleId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
        public string PictureUrl { get; set; }
        public List<long> Users { get; set; }
        public string UsersString { get; set; }
    }
}
