using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class UserProfileService : Repository<UserProfile>, IUserProfileService
    {
        public UserProfileService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<UserProfile> GetAllUserProfiles()
        {
            DbCommand cmd = LoadCmd("GetAllUserProfiles");
            return ExecuteReader(cmd);
        }

        public UserProfile GetUserProfile(long id)
        {
            DbCommand cmd = LoadCmd("GetUserProfile");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public IEnumerable<UserProfile> GetUserProfilesByDepartments(string ids)
        {
            DbCommand cmd = LoadCmd("GetUserProfilesByDepartments");
            cmd = AddParameter(cmd, "Ids", ids);
            return ExecuteReader(cmd);
        }

        public void CreateUserProfile(UserProfile user) =>
        Add(user);

        public void UpdateUserProfile(UserProfile user) =>
        Update(user, user.Id);

        public void DeleteUserProfile(UserProfile user) =>
        Delete(user);

        public UserProfile GetUserByUserId(string id) =>
        Find(w => w.UserId == id);

        public IEnumerable<UserProfile> GetUserProfilesByIds(string ids)
        {
            DbCommand cmd = LoadCmd("GetUserProfilesByIds");
            cmd = AddParameter(cmd, "Ids", ids);
            return ExecuteReader(cmd);
        }

        public IEnumerable<UserProfile> GetUsersEmailByRole(string roleName)
        {
            DbCommand cmd = LoadCmd("GetUsersEmailByRol");
            cmd = AddParameter(cmd, "RoleName", roleName);
            return ExecuteReader(cmd);
        }
    }
}
