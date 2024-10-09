using GerenciaMusic360.Common;
using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IUserProfileService _userProfileService;
        private readonly IRoleProfileService _roleProfileService;
        private readonly UserManager<AspNetUsers> _userManager;
        private readonly IPasswordRecoverService _passwordRecoverService;
        private readonly IHelperService _helperService;
        private readonly IConfiguration _configuration;
        private readonly INotificationService _notification;
        private readonly IMailDispatcherService _mailDispatcherService;
        private readonly IPermissionService _permissionService;

        public AccountController(
           IAccountService accountService,
           IUserProfileService userProfileService,
           IRoleProfileService roleProfileService,
           UserManager<AspNetUsers> userManager,
           IPasswordRecoverService passwordRecoverService,
           IHelperService helperService,
           IConfiguration configuration,
           INotificationService notificationService,
           IMailDispatcherService mailDispatcherService,
            IPermissionService permissionService
            )
        {
            _accountService = accountService;
            _userProfileService = userProfileService;
            _roleProfileService = roleProfileService;
            _userManager = userManager;
            _passwordRecoverService = passwordRecoverService;
            _helperService = helperService;
            _configuration = configuration;
            _notification = notificationService;
            _mailDispatcherService = mailDispatcherService;
            _permissionService = permissionService;
        }

        [Route("api/Login")]
        [HttpPost]
        public MethodResponse<CurrentUser> Post([FromBody]LoginModel model)
        {
            var result = new MethodResponse<CurrentUser> { Code = 100, Message = "Success", Result = null };
            try
            {
                ClaimsIdentity identity = GetClaimsIdentity(model.Email, model.Password).Result;
                if (identity != null)
                {

                    AspNetUsers user = _userManager.FindByEmailAsync(model.Email).Result;
                    UserProfile userProfile = _userProfileService.GetUserByUserId(user.Id);
                    userProfile = _userProfileService.GetUserProfile(userProfile.Id);

                    RoleProfile role = _roleProfileService.GetRoleProfile(userProfile.RoleId);
                    if (role?.StatusRecordId == 1)
                    {
                        if (userProfile.StatusRecordId == 1)
                        {
                            result.Result =
                                _accountService.GenerateJwt(identity, _accountService, model.Email, new JWT { }, userProfile.Id);
#if DEBUG
                            // GetAllControllersAndActions();
#endif
                        }
                        else
                        {
                            result.Code = -50;
                        }
                    }
                    else
                        result.Code = -200;
                }
                else
                    result.Code = -150;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        private void GetAllControllersAndActions()
        {
            try
            {
                var controllers = Assembly.GetExecutingAssembly().GetExportedTypes().Where(t => typeof(ControllerBase).IsAssignableFrom(t)).Select(t => t);
                var permissions = new List<Permission>();
                foreach (System.Type controller in controllers)
                {
                    var actions = controller.GetMethods().Where(t => t.Name != "Dispose" && !t.IsSpecialName && t.DeclaringType.IsSubclassOf(typeof(ControllerBase)) && t.IsPublic && !t.IsStatic).ToList();
                    foreach (var action in actions)
                    {
                        if (!permissions.Where(item => item.ActionName == action.Name && item.ControllerName == controller.Name).Any())
                        {
                            permissions.Add(new Permission
                            {
                                ControllerName = controller.Name,
                                Name = controller.Name.Replace("Controller", ""),
                                ActionName = action.Name
                            });
                        }
                    }
                }
                foreach (Permission item in permissions)
                {
                    _permissionService.Create(item);
                }
            }
            catch (Exception)
            {
            }
        }
        [Route("api/PasswordRecover")]
        [HttpPost]
        public MethodResponse<bool> Post(string email)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                if (!Utilities.IsEmailValid(email))
                {
                    result.Result = true;
                    result.Message = "Email format incorrect";
                    result.Code = -35;
                    return result;
                }
                AspNetUsers user = _userManager.FindByEmailAsync(email).Result;
                if (user != null)
                {
                    var timeNow = DateTime.Now;
                    string stringData = $"{timeNow.ToString()},{user.Id},{user.UserName},{user.Email}";
                    string code = _helperService.Base64Encode(
                        _helperService.Encrypt(stringData, _configuration.GetValue<string>("KeyEncript")));

                    PasswordRecover recover = _passwordRecoverService
                        .CreatePasswordRecover(new PasswordRecover
                        {
                            Date = timeNow,
                            Email = email,
                            Status = false,
                            ExpiredDate = timeNow.AddHours(24),
                            Code = code
                        });

                    Notification template = _notification.GetNotification(NotificationType.PasswordRecover);
                    string url = _configuration.GetValue<string>("URL");
                    List<ReplaceModel> replaces = new List<ReplaceModel>()
                    {
                        new ReplaceModel {  Key="Code", Value =$"{url}/auth/login?code={code}" }
                    };

                    string body = _mailDispatcherService.ReplaceTag(template.HtmlBody, replaces);

                    string display = _configuration.GetValue<string>("Display");

                    _helperService.SendEmail(
                        GetMailConfig(),
                        $"{template.Subject} {display}",
                        body,
                        new List<string> { user.Email }
                        );
                }
                else
                    result.Code = -50;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/PasswordRecover")]
        [HttpGet]
        public MethodResponse<bool> Get(string code)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                PasswordRecover passwordRecover = _passwordRecoverService.FindPasswordRecover(code);
                if (passwordRecover.ExpiredDate > DateTime.Now & passwordRecover.Status == false)
                    result.Result = true;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private MailConfig GetMailConfig()
        {
            return new MailConfig
            {
                Display = _configuration.GetValue<string>("Display"),
                EnableSSL = _configuration.GetValue<bool>("EnableSSL"),
                Host = _configuration.GetValue<string>("HostEmail"),
                UserName = _configuration.GetValue<string>("Email"),
                Password = _configuration.GetValue<string>("Password"),
                Port = _configuration.GetValue<int>("Port")
            };
        }

        [Route("api/PasswordRecoverReset")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]NewPasswordModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string data = _helperService.Decrypt(
                    _helperService.Base64Decode(model.Code), _configuration.GetValue<string>("KeyEncript"));

                string[] dataSplit = data.Split(",");
                AspNetUsers user = _userManager.FindByEmailAsync(dataSplit[3]).Result;

                IdentityResult remove = _userManager.RemovePasswordAsync(user).Result;
                IdentityResult change = _userManager.AddPasswordAsync(user, model.Password).Result;

                var passwordRecover = _passwordRecoverService.FindPasswordRecover(model.Code);
                passwordRecover.RecoverDate = DateTime.Now;
                passwordRecover.Status = true;

                _passwordRecoverService.UpdatePasswordRecover(passwordRecover);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        private async Task<ClaimsIdentity> GetClaimsIdentity(string userName, string password)
        {
            if (string.IsNullOrEmpty(userName) || string.IsNullOrEmpty(password))
                return await Task.FromResult<ClaimsIdentity>(null);

            AspNetUsers userToVerify = await _userManager.FindByNameAsync(userName);

            if (userToVerify == null) return await Task.FromResult<ClaimsIdentity>(null);

            if (await _userManager.CheckPasswordAsync(userToVerify, password))
            {
                return await Task.FromResult(_accountService.GenerateClaimsIdentity(userName, userToVerify.Id));
            }

            return await Task.FromResult<ClaimsIdentity>(null);
        }
    }
}