using System;

namespace GerenciaMusic360.Entities
{
    public class Comments
    {
        public int Id { get; set; }
        public string CommentType { get; set; }
        public string CommentDescription { get; set; }
        public string UserId { get; set; }
        public short IsNew { get; set; }
        public DateTime CommentDate { get; set; }
        public short StatusRecordId { get; set; }
    }
}
