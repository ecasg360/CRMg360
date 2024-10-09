using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class Person
    {
        public Person()
        {
            WorkCollaborator = new HashSet<WorkCollaborator>();
        }
        public int Id { get; set; }
        public string LastName { get; set; }
        public string OfficePhone { get; set; }
        public string CellPhone { get; set; }
        public string Email { get; set; }
        public DateTime? BirthDate { get; set; }
        public string PictureUrl { get; set; }
        public short StatusRecordId { get; set; }
        public int EntityId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public string Name { get; set; }
        public string SecondLastName { get; set; }
        public string Gender { get; set; }
        public string Biography { get; set; }
        public string AliasName { get; set; }
        public decimal? Price { get; set; }
        public string GeneralTaste { get; set; }
        public int? PersonTypeId { get; set; }
        public string WebSite { get; set; }
        public string BirthDateString { get; set; }
        public string StartDateJoinedString { get; set; }
        public string EndDateJoinedString { get; set; }
        public int? PersonRelationId { get; set; }
        public int MainActivityId { get; set; }
        public int ProjectId { get; set; }
        public int TypeId { get; set; }
        public bool IsInternal { get; set; }
        public ICollection<WorkCollaborator> WorkCollaborator { get; set; }
        public short? AssociationId { get; set; }

        [NotMapped]
        public string PersonTypeDescription { get; set; }

        [NotMapped]
        public ComposerDetail ComposerDetail { get; set; }
    }
}
