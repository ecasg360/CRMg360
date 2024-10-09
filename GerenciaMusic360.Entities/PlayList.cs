namespace GerenciaMusic360.Entities
{
    public partial class PlayList
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Active { get; set; }
        public int SocialNetworkTypeId { get; set; }
        public string SocialNetworkTypeName { get; set; }
    }
}
