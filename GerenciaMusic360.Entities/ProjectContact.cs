namespace GerenciaMusic360.Entities
{
    public partial class ProjectContact
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int PersonId { get; set; }
        public int TypeId { get; set; }
    }
}
