using System;

namespace GerenciaMusic360.Entities
{
    public class ControlledList
    {
        public int IsExternal { get; set; }
        public string WorkName { get; set; }
        public string WorkAka { get; set; }
        public string Artist { get; set; }
        public string Album { get; set; }
        public string Upc { get; set; }
        public string Publisher { get; set; }
        public int AdminPercentage { get; set; }
        public string CoEdition { get; set; }
        public string TerritoryControlled { get; set; }
        public string Isrc { get; set; }
        public string Time { get; set; }
        public DateTime ReleaseDate { get; set; }
        public string ComposersName { get; set; }
        public string ComposersAka { get; set; }
        public string ComposerPro { get; set; }

        public string ComposerIpi { get; set; }
        public string RegisteredWithPro { get; set; }
        public DateTime AgreementDate { get; set; }

        public string ComposerContactDetails { get; set; }

        public string CopyrightRegistration { get; set; }
        public string WorkDescription { get; set; }
        public int LdvRelease { get; set; }
    }
}
