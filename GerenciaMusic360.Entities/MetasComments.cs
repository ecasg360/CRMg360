using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace GerenciaMusic360.Entities
{
    public class MetasComments
    {
        public int Id { get; set; }
        public int MetaId { get; set; }
        public string UserId { get; set; }
        public string GoalMessage { get; set; }
        public DateTime CommentDate { get; set; }
        [NotMapped]
        public string UserName { get; set; }
    }
}
