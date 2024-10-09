using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class WorkPublisher
    {
        public int Id { get; set; }
        public int WorkId { get; set; }
        public decimal? AmountRevenue { get; set; }
        public decimal? PercentageRevenue { get; set; }
        public short? AssociationId { get; set; }
        public int PublisherId { get; set; }

        public Association Association { get; set; }
        public Publisher Publisher { get; set; }
        public Work Work { get; set; }
    }
}
