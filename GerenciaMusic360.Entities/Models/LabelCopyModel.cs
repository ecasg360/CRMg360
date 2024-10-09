using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class LabelCopyModel
    {
        public LabelCopyHeader LabelCopyHeader { get; set; }
        public IEnumerable<LabelCopyDetail> LabelCopyDetail { get; set; }
    }

    public class LabelCopyHeader
    {
        public string Artist { get; set; }
        public string Title { get; set; }
        public string ExecutiveProducer { get; set; }
        public string Studio { get; set; }
        public string Distributor { get; set; }
        public string UPCCode { get; set; }
        public DateTime? StreetDate { get; set; }
        public string RecordingEnginner { get; set; }
        public DateTime? DateLastUpdate { get; set; }
        public string MixMaster { get; set; }
        public string ProjectType { get; set; }
        public string Location { get; set; }
        public DateTime? EndDate { get; set; }
        public string RecordLabel { get; set; }
        public string Producers { get; set; }
    }

    public class LabelCopyDetail
    {
        public string Artist { get; set; }
        public string Title { get; set; }
        public string Composer { get; set; }
        public string Association { get; set; }
        public string Time { get; set; }
        public string ISRC { get; set; }
        public string Producer { get; set; }
        public string Remixer { get; set; }
        public int NumberTrack { get; set; }
        public string Publisher { get; set; }
    }
}
