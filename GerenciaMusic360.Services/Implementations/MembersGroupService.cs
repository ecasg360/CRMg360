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
    public class MembersGroupService : Repository<MembersGroup>, IMembersGroupService
    {
        public MembersGroupService(Context_DB repositoryContext) : base(repositoryContext)
        {
        }
        void IMembersGroupService.Create(MembersGroup memberGrup) => Add(memberGrup);

        void IMembersGroupService.Delete(MembersGroup memberGrup) => Delete(memberGrup);

        MembersGroup IMembersGroupService.Get(int id)
        {
            DbCommand cmd = LoadCmd("GetMembersGroup");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        IEnumerable<MembersGroup> IMembersGroupService.GetAll()
        {
            DbCommand cmd = LoadCmd("GetMembersGroups");
            return ExecuteReader(cmd);
        }

        void IMembersGroupService.Update(MembersGroup memberGrup)
        {
            throw new NotImplementedException();
        }
    }
}
