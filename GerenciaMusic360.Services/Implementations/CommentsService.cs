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
    public class CommentsService : Repository<Comments>, ICommentsService
    {
        public CommentsService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Comments> GetAllComments()
        {
            return this.GetAll();
        }

        public Comments GetComment(int id)
        {
            try
            {
                DbCommand cmd = LoadCmd("GetComments");
                cmd = AddParameter(cmd, "Id", id);
                return ExecuteReader(cmd).First();
            }
            catch (Exception e)
            {
                return null;
            }

        }

        public Comments CreateComment(Comments model) =>
        Add(model);

        public void UpdateComment(Comments model) =>
        Update(model, model.Id);

        public void DeleteComment(Comments model) =>
        Delete(model);

    }
}
