using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IUserProfileService
    {
        IEnumerable<UserProfile> GetAllUserProfiles();
        UserProfile GetUserProfile(long id);
        IEnumerable<UserProfile> GetUserProfilesByDepartments(string ids);
        IEnumerable<UserProfile> GetUserProfilesByIds(string ids);
        void CreateUserProfile(UserProfile user);
        void UpdateUserProfile(UserProfile user);
        void DeleteUserProfile(UserProfile user);
        UserProfile GetUserByUserId(string id);
        IEnumerable<UserProfile> GetUsersEmailByRole(string roleName);
    }
}
