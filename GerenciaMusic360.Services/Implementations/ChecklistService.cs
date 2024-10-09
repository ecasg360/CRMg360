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
    public class ChecklistService : Repository<Checklist>, IChecklistService
    {
        public ChecklistService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Checklist> GetAllRecords()
        {
            return this.GetAll();
        }
        public Checklist GetRecord(int id)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetChecklist");
                cmd = AddParameter(cmd, "Id", id);
                return ExecuteReader(cmd).First();
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public Checklist CreateRecord(Checklist model) =>
        Add(model);

        public void UpdateRecord(Checklist model) =>
        Update(model, model.Id);

        public void DeleteRecord(Checklist model) =>
        Delete(model);
    }
}
