using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Permission
    {
        public Permission()
        {
            RolProfilePermission = new HashSet<RolProfilePermission>();
        }

        public long Id { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? IsRequired { get; set; }

        public ICollection<RolProfilePermission> RolProfilePermission { get; set; }
    }
}
