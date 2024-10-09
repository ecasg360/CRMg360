using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAssociationService
    {
        IEnumerable<Association> GetAllAssociations();
        Association SaveAssociation(Association entity);
        Association UpdateAssociation(Association entity);
        Association GetAssociation(int id);
    }
}
