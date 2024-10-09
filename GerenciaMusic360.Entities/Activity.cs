using System;

namespace GerenciaMusic360.Entities
{
    public class Activity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string PictureURL { get; set; }
        public DateTime VerificationDate { get; set; }
    }
}
