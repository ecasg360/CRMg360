using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace GerenciaMusic360.Entities
{
    public class Metas
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string GoalDescription { get; set; }
        public short Completed { get; set; }
        public DateTime InitialDate { get; set; }
        [NotMapped]
        public string UserName { get; set; }
        [NotMapped]
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public short IsMeasurable { get; set; }
        public short IsCompleted { get; set; }
    }
}
