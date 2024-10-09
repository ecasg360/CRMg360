namespace GerenciaMusic360.Entities
{
    public partial class ProjectMember
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public long UserId { get; set; }
        public int ProjectRoleId { get; set; }
    }
}
