using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace GerenciaMusic360.Entities
{
    public partial class ProjectWork
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public int? AlbumId { get; set; }
        public int ItemId { get; set; }
        public int ProductionTypeId { get; set; }
        public bool IsInternal { get; set; }
        public string AlbumName { get; set; }
        public string ItemName { get; set; }
        public string ProductionTypeName { get; set; }
        public string ISRC { get; set; }
        public int? PersonProducerId { get; set; }
        public bool IsComposerInternal { get; set; }
        public int? PersonComposerId { get; set; }
        public short? EditorId { get; set; }
        public short? AssociationId { get; set; }
        public int? PersonRemixId { get; set; }
        public int? WorkRelatedId { get; set; }
        public int? ForeignWorkRelatedId { get; set; }
        public bool? IsInternalRelated { get; set; }


        [NotMapped]
        public int TrackId { get; set; }

        [NotMapped]
        public int WorkId { get; set; }

        [NotMapped]
        public decimal AmountRevenue { get; set; }

        [NotMapped]
        public string TrackName { get; set; }

        [NotMapped]
        public int TrackWorkId { get; set; }

        [NotMapped]
        public string TrackWorkISRC { get; set; }

        [NotMapped]
        public int NumberTrack { get; set; }

        [NotMapped]
        public string TrackTime { get; set; }

        [NotMapped]
        public string TrackWorkUPC { get; set; }

        [NotMapped]
        public DateTime TrackReleaseDate { get; set; }

        [NotMapped]
        public DateTime TrackSoundRecordingRegistration { get; set; }

        [NotMapped]
        public DateTime TrackMusicCopyright { get; set; }

        [NotMapped]
        public DateTime TrackSoundExchangeRegistration { get; set; }

        [NotMapped]
        public DateTime TrackWorkForHireSound { get; set; }

        [NotMapped]
        public DateTime TrackWorkForHireVideo { get; set; }

        [NotMapped]
        public decimal PercentageRevenueTotal { get; set; }

        [NotMapped]
        public decimal PercentageRevenueLeft { get; set; }

        [NotMapped]
        public decimal PercentageAdminLeft { get; set; }

        [NotMapped]
        public decimal PercentageAdminTotal { get; set; }

        [NotMapped]
        public List<WorkCollaborator> WorkCollaborators { get; set; }

        [NotMapped]
        public List<Editoras> Editoras { get; set; }

        [NotMapped]
        public List<ProjectWorkAdmin> ProjectWorkAdmin { get; set; }

        [NotMapped]
        public List<WorkRecording> WorkRecordings { get; set; }

        [NotMapped]
        public Work Work { get; set; }
        [NotMapped]
        public Person Producer { get; set; }
        [NotMapped]
        public Person MixMaster { get; set; }
        public string ComposersList { get; set; }
        public string PublishersList { get; set; }
        public int? PersonPublisherId { get; set; }


    }

    public class Editoras
    {
        public string key { get; set; }
        public int value { get; set; }
        public decimal percent { get; set; }
    }
}
