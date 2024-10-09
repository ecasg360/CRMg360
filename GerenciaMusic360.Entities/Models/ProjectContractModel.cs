using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class ProjectContractModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PictureUrl { get; set; }
        public short contractType { get; set; }
        public string Type { get; set; }
        public List<ProjectWork> projectWorks { get; set; }
    }
}
