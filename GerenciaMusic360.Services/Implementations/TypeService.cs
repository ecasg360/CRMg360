using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class TypeService : Repository<Type>, ITypeService
    {
        public TypeService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Type> GetAllTypes(int typeId)
        {
            DbCommand cmd = LoadCmd("GetTypes");
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd);
        }

        public Type GetType(int id, int typeId)
        {
            DbCommand cmd = LoadCmd("GetType");
            cmd = AddParameter(cmd, "Id", id);
            cmd = AddParameter(cmd, "TypeId", typeId);
            return ExecuteReader(cmd).First();
        }

        public Type CreateType(Type type, string user)
        {
            DbCommand cmd = LoadCmd("InsertType");
            cmd = AddParameter(cmd, "TypeId", type.TypeId);
            cmd = AddParameter(cmd, "Name", type.Name);
            cmd = AddParameter(cmd, "Description", type.Description);
            cmd = AddParameter(cmd, "User", user);
            return ExecuteReader(cmd).First();
        }

        public void UpdateType(Type type, string user)
        {
            DbCommand cmd = LoadCmd("UpdateType");
            cmd = AddParameter(cmd, "Id", type.Id);
            cmd = AddParameter(cmd, "TypeId", type.TypeId);
            cmd = AddParameter(cmd, "Name", type.Name);
            cmd = AddParameter(cmd, "Description", type.Description);
            cmd = AddParameter(cmd, "User", user);
            ExecuteReader(cmd);
        }

        public void UpdateStatusType(Type type, string user)
        {
            DbCommand cmd = LoadCmd("UpdateStatusType");
            cmd = AddParameter(cmd, "Id", type.Id);
            cmd = AddParameter(cmd, "TypeId", type.TypeId);
            cmd = AddParameter(cmd, "StatusRecordId", type.StatusRecordId);
            cmd = AddParameter(cmd, "User", user);
            ExecuteReader(cmd);
        }
    }
}
