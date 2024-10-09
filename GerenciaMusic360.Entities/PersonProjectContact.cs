using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public class PersonProjectContact : Person
    {
        public int ProjectTypeId { get; set; }
        public List<ProjectContact> ProjectContacts { get; set; }
    }
}
