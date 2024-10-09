
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Principal;
using static GerenciaMusic360.Common.Constant;

namespace GerenciaMusic360.Services.Implementations
{
    public class AccountService : IAccountService
    {
        private readonly JWT _jwtOptions;
        private readonly IPermissionService _permissionService;
        private readonly IRolProfilePermissionService _rolProfilePermissionService;
        private readonly IRoleProfileService _roleProfileService;
        private readonly IUserProfileService _userProfileService;
        public AccountService(IOptions<JWT> jwtOptions, IPermissionService permissionService,
            IRolProfilePermissionService rolProfilePermissionService,
            IRoleProfileService roleProfileService,
            IUserProfileService userProfileService
            )
        {
            _jwtOptions = jwtOptions.Value;
            _permissionService = permissionService;
            _rolProfilePermissionService = rolProfilePermissionService;
            _roleProfileService = roleProfileService;
            _userProfileService = userProfileService;
            ThrowIfInvalidOptions(_jwtOptions);
        }

        public string GenerateEncodedToken(string userName, ClaimsIdentity identity)
        {
            Claim[] claims = new[]
            {
                 new Claim(JwtRegisteredClaimNames.Sub, userName),
                 new Claim(JwtRegisteredClaimNames.Jti,  _jwtOptions.JtiGenerator),
                 new Claim(JwtRegisteredClaimNames.Iat, ToUnixEpochDate(_jwtOptions.IssuedAt).ToString(), ClaimValueTypes.Integer64),
                 identity.FindFirst(Strings.JwtClaimIdentifiers.Rol),
                 identity.FindFirst(Strings.JwtClaimIdentifiers.Id),
             };
            claims = GetRoleProfilePermission(claims.ToList(), identity.FindFirst("id").Value);
            JwtSecurityToken jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);

            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            return encodedJwt;
        }

        private Claim[] GetRoleProfilePermission(List<Claim> claims, string idUser)
        {
            try
            {
                var user = _userProfileService.GetUserByUserId(idUser);
                var userProfile = _userProfileService.GetUserProfile(user.Id);
                var rolePermissions = _rolProfilePermissionService.GetList().
                    Where(rp => rp.RoleProfileId == userProfile.RoleId).ToList().Select(p => p.PermissionId).ToList();
                var permission = _permissionService.GetList().Where(p => rolePermissions.Contains(p.Id) && p.IsRequired == true).ToList();
                var controllers = permission.Select(p => p.ControllerName).Distinct();
                foreach (string controller in controllers)
                {
                    var per = string.Join(',', permission.Where(p => p.ControllerName == controller).Select(p => p.ActionName));
                    claims.Add(new Claim(controller.Replace("Controller", ""), per));
                }
                return claims.ToArray();
            }
            catch (Exception)
            {
                return claims.ToArray();
            }

        }

        public ClaimsIdentity GenerateClaimsIdentity(string userName, string id)
        {
            return new ClaimsIdentity(new GenericIdentity(userName, "Token"), new[]
            {
                new Claim(Strings.JwtClaimIdentifiers.Id, id),

            });
        }

        private static long ToUnixEpochDate(DateTime date) =>
            (long)Math.Round((date.ToUniversalTime() -
                               new DateTimeOffset(1970, 1, 1, 0, 0, 0, TimeSpan.Zero))
                              .TotalSeconds);

        public CurrentUser GenerateJwt(ClaimsIdentity identity, IAccountService _accountService, string userName, JWT jwtOptions, long userId)
        {
            CurrentUser response = new CurrentUser
            {
                Id = identity.Claims.Single(c => c.Type == "id").Value,
                AuthToken = _accountService.GenerateEncodedToken(userName, identity),
                ExpiresIn = (int)jwtOptions.ValidFor.TotalSeconds,
                UserId = userId
            };
            return response;
        }

        private static void ThrowIfInvalidOptions(JWT options)
        {
            if (options == null) throw new ArgumentNullException(nameof(options));

            if (options.ValidFor <= TimeSpan.Zero)
                throw new ArgumentException("Must be a non-zero TimeSpan.", nameof(JWT.ValidFor));

            if (options.SigningCredentials == null)
                throw new ArgumentNullException(nameof(JWT.SigningCredentials));

            if (options.JtiGenerator == null)
                throw new ArgumentNullException(nameof(JWT.JtiGenerator));
        }
    }
}
