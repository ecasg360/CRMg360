using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class WorkCollaborator
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public int ComposerId { get; set; }
        public decimal? AmountRevenue { get; set; }
        public decimal PercentageRevenue { get; set; }
        public bool? IsCollaborator { get; set; }
        public short? AssociationId { get; set; }
        [NotMapped]
        public Person Composer { get; set; }
        [NotMapped]
        public Work Work { get; set; }
        [NotMapped]
        public ComposerDetail ComposerDetail { get; set; }
        public Association Association { get; set; }
    }
}
