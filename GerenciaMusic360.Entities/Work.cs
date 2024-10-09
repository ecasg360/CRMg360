using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Entities
{
    public partial class Work
    {
        public Work()
        {
            WorkCollaborator = new HashSet<WorkCollaborator>();
            WorkPublisher = new HashSet<WorkPublisher>();
        }
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int? AlbumId { get; set; }
        public int? MusicalGenreId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? RevenueTypeId { get; set; }
        public short StatusRecordId { get; set; }
        public decimal? AmountRevenue { get; set; }
        public decimal Rating { get; set; }
        public string PictureUrl { get; set; }
        public bool RegisteredWork { get; set; }
        public string RegisterNum { get; set; }
        public DateTime? RegisterDate { get; set; }
        public bool CertifiedWork { get; set; }
        public int? CertificationAuthorityId { get; set; }
        public string LicenseNum { get; set; }
        public DateTime Created { get; set; }
        public string Creator { get; set; }
        public DateTime? Modified { get; set; }
        public string Modifier { get; set; }
        public DateTime? Erased { get; set; }
        public string Eraser { get; set; }
        public int StatusId { get; set; }
        public string CreatedDateString { get; set; }
        public string RegisterDateString { get; set; }
        public int PersonRelationId { get; set; }
        public ICollection<WorkCollaborator> WorkCollaborator { get; set; }
        public ICollection<WorkPublisher> WorkPublisher { get; set; }
        public bool? isExternal { get; set; }
        public int? ComposerId { get; set; }
        public string SongId { get; set; }
        public string Aka { get; set; }
        public int? AdminPercentage { get; set; }
        public DateTime? MusicCopyrightDate { get; set; }
        public string CopyrightNum { get; set; }
        public string Coedition { get; set; }
        public string TerritoryControlled { get; set; }
        public DateTime? AgreementDate { get; set; }
        public bool? LdvRelease { get; set; }
    }
}
