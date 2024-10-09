using System;
using System.Collections.Generic;
using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICommentsService
    {
        IEnumerable<Comments> GetAllComments();
        Comments GetComment(int id);
        Comments CreateComment(Comments model);
        void UpdateComment(Comments model);
        void DeleteComment(Comments model);
    }
}
