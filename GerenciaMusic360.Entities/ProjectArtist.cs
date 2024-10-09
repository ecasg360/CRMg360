namespace GerenciaMusic360.Entities
{
    public partial class ProjectArtist
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int GuestArtistId { get; set; }
    }
}
