using System;

namespace GerenciaMusic360.Entities
{
    public partial class PersonSocialNetwork
    {
        public int Id { get; set; }
        public int? PersonId { get; set; }
        public string Link { get; set; }
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public int SocialNetworkTypeId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
