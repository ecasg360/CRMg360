using System;

namespace GerenciaMusic360.Entities
{
    public class Composer
    {
        public int Id { get; set; }
        public int PersonId { get; set; }
        public string WebSite { get; set; }
        public decimal Rating { get; set; }
        public bool Active { get; set; }
        public string Summary { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}
