using System;
using System.Linq;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectLabelCopy
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int PersonProducerExecutiveId { get; set; }
        public int PersonRecordingEngineerId { get; set; }
        public short StudioId { get; set; }
        public short DistributorId { get; set; }
        public DateTime DateLastUpdate { get; set; }
        public int PersonMixMasterId { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public string Location { get; set; }
        public string RecordLabel { get; set; }
        public string Producers { get; set; }
        [NotMapped]
        public int[] ProducerList
        {
            get
            {
                if (Producers!= null)
                {
                    return Array.ConvertAll(Producers.Split(';'), int.Parse);
                } else
                {
                    return null;
                }
            }
            set
            {
                var _data = value;
                Producers = String.Join(";", _data.Select(p => p.ToString()).ToArray());
            }
        }
    }
}
