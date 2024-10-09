using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class DayliReport
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Description { get; set; }
        public short Completed { get; set; }
        public DateTime InitialDate { get; set; }
        [NotMapped]
        public string UserName { get; set; }
    }
}
