using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class UserProfileController : ControllerBase
    {
        private readonly IUserProfileService _userProfileService;
        private readonly UserManager<AspNetUsers> _userManager;
        private readonly IRoleProfileService _roleProfileService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;

        public UserProfileController(
            UserManager<AspNetUsers> userManager,
            IRoleProfileService roleProfileService,
            IUserProfileService userProfileService,
            IHelperService helperService,
            IHostingEnvironment env)
        {
            _userManager = userManager;
            _roleProfileService = roleProfileService;
            _userProfileService = userProfileService;
            _helperService = helperService;
            _env = env;
        }

        [Route("api/Users")]
        [HttpGet]
        public MethodResponse<List<UserModel>> Get()
        {
            var result = new MethodResponse<List<UserModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _userProfileService.GetAllUserProfiles()
                    .Select(s => new UserModel
                    {
                        Id = s.Id,
                        PictureUrl = s.PictureUrl,
                        Name = s.Name,
                        LastName = s.LastName,
                        SecondLastName = s.SecondLastName,
                        Status = s.StatusRecordId,
                        UserId = s.UserId,
                        Email = s.Email,
                        DepartmentId = s.DepartmentId,
                        Role = s.Role
                    }).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/User")]
        [HttpGet]
        public MethodResponse<UserModel> Get(long id)
        {
            var result = new MethodResponse<UserModel> { Code = 100, Message = "Success", Result = null };
            try
            {
                UserProfile user = _userProfileService.GetUserProfile(id);

                result.Result = new UserModel
                {
                    Id = user.Id,
                    PictureUrl = user.PictureUrl,
                    Name = user.Name,
                    LastName = user.LastName,
                    SecondLastName = user.SecondLastName,
                    PhoneOne = user.PhoneOne,
                    Birthdate = user.Brithdate.ToString("yyyy/M/d"),
                    Email = user.Email,
                    Status = user.StatusRecordId,
                    UserId = user.UserId,
                    Gender = user.Gender,
                    DepartmentId = user.DepartmentId,
                    RoleId = user.RoleId
                };
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/User")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] UserModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                AspNetUsers user = new AspNetUsers
                {
                    Email = model.Email,
                    UserName = model.Email
                };

                Task<IdentityResult> r = _userManager.CreateAsync(user, model.Password);
                if (r.Result.Succeeded)
                {
                    string pictureURL = string.Empty;
                    if (model.PictureUrl?.Length > 0)
                        pictureURL = _helperService.SaveImage(
                            model.PictureUrl.Split(",")[1],
                            "profile", $"{user.Id}.jpg",
                            _env);

                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                    _userProfileService.CreateUserProfile(new UserProfile
                    {
                        UserId = user.Id,
                        Name = model.Name,
                        LastName = model.LastName,
                        SecondLastName = model.SecondLastName,
                        StatusRecordId = 1,
                        PhoneOne = model.PhoneOne,
                        PhoneTwo = model.PhoneOne,
                        Gender = model.Gender,
                        DepartmentId = model.DepartmentId,
                        Brithdate = DateTime.Parse(model.Birthdate),
                        PictureUrl = pictureURL,
                        Creator = userId,
                        Created = DateTime.Now
                    });

                    RoleProfile role = _roleProfileService.GetRoleProfile(model.RoleId);
                    _userManager.AddToRoleAsync(user, role.Name).Wait();
                }
                else
                {
                    string errors = string.Empty;
                    r.Result.Errors.ToList().ForEach(f => errors += $"{f.Description}, ");
                    result.Code = -100;
                    result.Message = errors.Remove(errors.Length - 1);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/User")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] UserModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                UserProfile user = _userProfileService.GetUserProfile(model.Id);
                AspNetUsers userApp = _userManager.FindByIdAsync(user.UserId).Result;
                userApp.Email = model.Email;
                userApp.UserName = model.Email;

                Task<IdentityResult> r = _userManager.UpdateAsync(userApp);
                if (r.Result.Succeeded)
                {
                    string pictureURL = null;
                    if (model.PictureUrl?.Length > 0)
                    {
                        if (model.PictureUrl.Split(",").Count() >= 2)
                        {
                            if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", user.PictureUrl)))
                                System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", user.PictureUrl));
                            pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1], "profile", $"{user.Id}.jpg", _env);
                        }
                    }

                    var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                    user.Name = model.Name;
                    user.LastName = model.LastName;
                    user.SecondLastName = model.SecondLastName;
                    user.PhoneOne = model.PhoneOne;
                    user.PhoneTwo = model.PhoneOne;
                    user.DepartmentId = model.DepartmentId;
                    user.Gender = model.Gender;
                    user.Brithdate = DateTime.Parse(model.Birthdate);
                    user.PictureUrl = pictureURL ?? user.PictureUrl;
                    user.Modified = DateTime.Now;
                    user.Modifier = userId;

                    _userProfileService.UpdateUserProfile(user);

                    if (user.RoleId != 0)
                    {
                        RoleProfile lastRole = _roleProfileService.GetRoleProfile(user.RoleId);
                        _userManager.RemoveFromRoleAsync(userApp, lastRole.Name).Wait();
                    }
                    RoleProfile role = _roleProfileService.GetRoleProfile(model.RoleId);
                    _userManager.AddToRoleAsync(userApp, role.Name).Wait();
                }
                else
                {
                    string errors = string.Empty;
                    r.Result.Errors.ToList().ForEach(f => errors += $"{f.Description}, ");

                    result.Code = -100;
                    result.Message = errors.Remove(errors.Length - 1);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/UserStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var user = _userProfileService.GetUserProfile(Convert.ToInt64(model.Id));
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                user.StatusRecordId = model.Status;
                user.Modified = DateTime.Now;
                user.Modifier = userId;
                _userProfileService.UpdateUserProfile(user);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/User")]
        [HttpDelete]
        public MethodResponse<bool> Delete(long id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var user = _userProfileService.GetUserProfile(id);
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                user.StatusRecordId = 3;
                user.Erased = DateTime.Now;
                user.Eraser = userId;
                _userProfileService.UpdateUserProfile(user);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
        [Route("api/UpdateProfile")]
        [HttpPost]
        public MethodResponse<UserModel> UpdateProfile([FromBody] UserModel model)
        {
            var result = new MethodResponse<UserModel> { Code = 100, Message = "Success", Result = new UserModel() };
            try
            {
                UserProfile user = _userProfileService.GetUserProfile(model.Id);
                AspNetUsers userApp = _userManager.FindByIdAsync(user.UserId).Result;

                string pictureURL = null;
                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (model.PictureUrl.Split(",").Count() >= 2)
                    {
                        if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", user.PictureUrl)))
                            System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", user.PictureUrl));
                        pictureURL = _helperService.SaveImage(model.PictureUrl.Split(",")[1], "profile", $"{Guid.NewGuid()}.jpg", _env);
                    }
                }
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                user.Name = model.Name;
                user.LastName = model.LastName;
                user.SecondLastName = model.SecondLastName;
                user.PhoneOne = model.PhoneOne;
                user.Gender = model.Gender;
                user.Brithdate = string.IsNullOrEmpty(model.Birthdate) ? user.Brithdate : DateTime.Parse(model.Birthdate);
                user.PictureUrl = pictureURL ?? user.PictureUrl;
                user.Modified = DateTime.Now;
                user.Modifier = userId;
                _userProfileService.UpdateUserProfile(user);
                result.Result = new UserModel
                {
                    Id = user.Id,
                    PictureUrl = user.PictureUrl,
                    Name = user.Name,
                    LastName = user.LastName,
                    SecondLastName = user.SecondLastName,
                    PhoneOne = user.PhoneOne,
                    Birthdate = user.Brithdate.ToString("yyyy/M/d"),
                    Email = user.Email,
                    Status = user.StatusRecordId,
                    UserId = user.UserId,
                    Gender = user.Gender,
                    DepartmentId = user.DepartmentId,
                    RoleId = user.RoleId
                };
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = new UserModel();
            }
            return result;
        }
    }
}