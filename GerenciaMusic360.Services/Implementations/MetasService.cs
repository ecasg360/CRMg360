using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;
using System.Text;

namespace GerenciaMusic360.Services.Implementations
{
    public class MetasService : Repository<Metas>, IMetasService
    {
        public MetasService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Metas> GetCurrentWeek(string InitialDate)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetMetasCurrentWeek");
                cmd = AddParameter(cmd, "InitialDate", InitialDate);
                return ExecuteReader(cmd);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public IEnumerable<Metas> GetByUserAndDate(string InitialDate, int UserId)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetMetasByUserAndDate");
                cmd = AddParameter(cmd, "UserId", UserId);
                cmd = AddParameter(cmd, "InitialDate", InitialDate);
                return ExecuteReader(cmd);
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public Metas GetRecord(int Id)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetMeta");
                cmd = AddParameter(cmd, "Id", Id);
                return ExecuteReader(cmd).First();
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public Metas CreateRecord(Metas model) =>
        Add(model);

        public void UpdateRecord(Metas model) =>
        Update(model, model.Id);

        public void DeleteRecord(Metas model) =>
        Delete(model);
    }
}
