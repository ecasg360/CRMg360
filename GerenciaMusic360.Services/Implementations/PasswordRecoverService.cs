using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;

namespace GerenciaMusic360.Services.Implementations
{
    public class PasswordRecoverService : Repository<PasswordRecover>, IPasswordRecoverService
    {
        public PasswordRecoverService(Context_DB repositoryContext)
            : base(repositoryContext)
        {
        }

        public PasswordRecover CreatePasswordRecover(PasswordRecover passwordRecover) =>
        Add(passwordRecover);

        public PasswordRecover FindPasswordRecover(string code) =>
        Find(w => w.Code == code);

        public PasswordRecover UpdatePasswordRecover(PasswordRecover passwordRecover) =>
        Update(passwordRecover, passwordRecover.Id);
    }
}
