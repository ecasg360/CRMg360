using GerenciaMusic360.Entities.Models.Chats;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces.Chats
{
    public interface IParticipantService
    {
        IEnumerable<ParticipantResponseViewModel> GetAllParticipantChat(string userdId);
        bool UpdateStatusParticipantChat(string userdId, int status);
    }
}
