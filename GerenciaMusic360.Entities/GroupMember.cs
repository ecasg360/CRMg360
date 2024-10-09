using System;

namespace GerenciaMusic360.Entities
{
    public partial class GroupMember
    {
        public int Id { get; set; }
        public int? PersonMemberId { get; set; }
        public int? GroupId { get; set; }
        public DateTime StartDateJoined { get; set; }
        public DateTime? EndDateJoined { get; set; }
        public int? MainAcitvityId { get; set; }
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
    }
}
