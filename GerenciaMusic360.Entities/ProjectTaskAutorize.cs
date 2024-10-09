using System;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectTaskAutorize
    {
        public int Id { get; set; }
        public int ProjectTaskId { get; set; }
        public int UserId { get; set; }
        public DateTime? VerificationDate { get; set; }
        public string Notes { get; set; }
        public string UserProfileName { get; set; }
        public string PictureUrl { get; set; }
    }
}
