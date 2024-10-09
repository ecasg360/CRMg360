using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class AddressService : Repository<Address>, IAddressService
    {
        public AddressService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Address> GetAddressesByPerson(int personId)
        {
            DbCommand cmd = LoadCmd("GetAddressByPerson");
            cmd = AddParameter(cmd, "PersonId", personId);
            return ExecuteReader(cmd);
        }

        public Address GetAddressesByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetAddressByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public Address GetAddress(int id)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetAddress");
                cmd = AddParameter(cmd, "Id", id);
                return ExecuteReader(cmd).First();
            }
            catch (Exception e) {
                return null;
            }
            
        }

        public Address CreateAddress(Address address) =>
        Add(address);

        public void CreateAddresses(List<Address> addresses) =>
        AddRange(addresses);

        public void UpdateAddress(Address address) =>
        Update(address, address.Id);
    }
}
