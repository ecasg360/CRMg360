using GerenciaMusic360.Entities;
using System.Security.Claims;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAccountService
    {
        string GenerateEncodedToken(string userName, ClaimsIdentity identity);
        ClaimsIdentity GenerateClaimsIdentity(string userName, string id);
        CurrentUser GenerateJwt(ClaimsIdentity identity, IAccountService _accountService, string userName, JWT jwtOptions, long userId);

    }
}
