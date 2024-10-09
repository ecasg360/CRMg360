using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MetasCommentsController : Controller
    {
        private readonly IMetasCommentsService _metasCommentsService;

        public MetasCommentsController(IMetasCommentsService metasCommentsService)
        {
            _metasCommentsService = metasCommentsService;
        }

        [Route("api/MetasComments")]
        [HttpGet]
        public MethodResponse<List<MetasComments>> Get(int metaId)
        {
            var result = new MethodResponse<List<MetasComments>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _metasCommentsService.GetCommentsByMetaId(metaId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MetasComments")]
        [HttpPost]
        public MethodResponse<int> Post([FromBody] MetasComments model)
        {
            var result = new MethodResponse<int> { Code = 100, Message = "Success", Result = 0 };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                model.CommentDate = DateTime.Now;
                MetasComments resultCreate = _metasCommentsService.CreateRecord(model);
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
    }
}
