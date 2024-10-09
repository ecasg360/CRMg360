using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class ProjectModel : Project
    {
        public virtual List<ProjectTaskAutorize> ProjectTaskAutorizes { get; set; }
    }
}
