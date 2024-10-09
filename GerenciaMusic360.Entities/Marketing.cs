using System;

namespace GerenciaMusic360.Entities
{
    public partial class Marketing
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string GeneralInformation { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public int StatusId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string DescriptionKeyIdeas { get; set; }
        public string DescriptionHeaderPlan { get; set; }
        public int FileId { get; set; }
        public string DescriptionHeaderOverviewMaterial { get; set; }
        public int? ProjectId { get; set; }
        public string StartDateString { get; set; }
        public string EndDateString { get; set; }
        public string PictureUrl { get; set; }
        public string ArtistName { get; set; }
        public string ArtistPictureUrl { get; set; }
    }
}
