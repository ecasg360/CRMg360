using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class AddressTypeService : Repository<AddressType>, IAddressTypeService
    {
        public AddressTypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<AddressType> GetAllAddressTypes()
        {
            DbCommand cmd = LoadCmd("GetAllAddressTypes");
            return ExecuteReader(cmd);
        }

        public AddressType GetAddressType(short id)
        {
            DbCommand cmd = LoadCmd("GetAddressType");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }
    }
}
