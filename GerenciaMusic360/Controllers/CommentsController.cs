using System;
using System.Collections.Generic;
using System.Linq;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentsService _commentsService;

        public CommentsController(ICommentsService commentsService)
        {
            _commentsService = commentsService;
        }

        [Route("api/Comments")]
        [HttpGet]
        public MethodResponse<List<Comments>> Get()
        {
            var result = new MethodResponse<List<Comments>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _commentsService.GetAllComments().ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Comments")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] Comments model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.CommentDate = DateTime.Now;
                model.IsNew = 1;
                model.UserId = userId;
                model.StatusRecordId = 1;

                Comments resultCreate = _commentsService.CreateComment(model);
                result.Result = resultCreate.Id;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = 0;
            }
            return result;
        }

        [Route("api/Comments")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Comments model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {

                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Comments comment = _commentsService.GetComment(model.Id);

                comment.CommentType = model.CommentType;
                comment.CommentDescription = model.CommentDescription;
                comment.IsNew = 1;
                _commentsService.UpdateComment(comment);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Comments")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Comments comment = _commentsService.GetComment(id);
                comment.StatusRecordId = 3;
                _commentsService.DeleteComment(comment);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}
