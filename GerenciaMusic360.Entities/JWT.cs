using Microsoft.IdentityModel.Tokens;
using System;

namespace GerenciaMusic360.Entities
{
    public class JWT
    {
        public string Issuer { get; set; }
        public string Subject { get; set; }
        public string Audience { get; set; }
        public DateTime Expiration => IssuedAt.AddDays(1);//Add(ValidFor);
        public DateTime NotBefore { get; set; } = DateTime.Now;
        public DateTime IssuedAt { get; set; } = DateTime.Now;
        public TimeSpan ValidFor { get; set; } = TimeSpan.FromDays(1);
        public string JtiGenerator { get; set; } = Guid.NewGuid().ToString();
        public SigningCredentials SigningCredentials { get; set; }
    }
}
