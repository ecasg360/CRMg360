using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IAddressService
    {
        IEnumerable<Address> GetAddressesByPerson(int personId);
        Address GetAddressesByType(int personId, int typeId);
        Address GetAddress(int id);
        Address CreateAddress(Address address);
        void CreateAddresses(List<Address> addresses);
        void UpdateAddress(Address address);
    }
}
