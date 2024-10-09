using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPasswordRecoverService
    {
        PasswordRecover CreatePasswordRecover(PasswordRecover passwordRecover);
        PasswordRecover FindPasswordRecover(string code);
        PasswordRecover UpdatePasswordRecover(PasswordRecover passwordRecover);
    }
}
