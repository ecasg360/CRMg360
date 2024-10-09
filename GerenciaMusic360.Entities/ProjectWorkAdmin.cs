using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public class ProjectWorkAdmin
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int ProjectWorkId { get; set; }
        public int WorkId { get; set; }
        public short EditorId { get; set; }
        public short Percentage { get; set; }

        [NotMapped]
        public Editor Editor { get; set; }
    }
}
