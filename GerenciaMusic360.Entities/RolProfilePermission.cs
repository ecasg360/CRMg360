namespace GerenciaMusic360.Entities
{
    public partial class RolProfilePermission
    {
        public long Id { get; set; }
        public int RoleProfileId { get; set; }
        public long PermissionId { get; set; }

        public Permission Permission { get; set; }
    }
}
