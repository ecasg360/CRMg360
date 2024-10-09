using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonTypeService
    {
        IEnumerable<PersonType> GetAllPersonTypes(int entity);
        PersonType GetPersonType(int id);
        PersonType GetPersonTypeNewId(int entityId);
        PersonType CreatePersonType(PersonType personType);
        void UpdatePersonType(PersonType personType);
        void DeletePersonType(PersonType personType);
    }
}
