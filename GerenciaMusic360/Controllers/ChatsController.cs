using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models.Chats;
using GerenciaMusic360.HubConfig;
using GerenciaMusic360.Services.Interfaces.Chats;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ChatsController : ControllerBase
    {

        private readonly IParticipantService _participantService;
        private readonly IMessageService _messageService;

        public ChatsController(IParticipantService participantService, IMessageService messageService)
        {
            this._participantService = participantService;
            this._messageService = messageService;

        }

        // Sending the userId from the request body as this is just a demo. 
        // On your application you probably want to fetch this from your authentication context and not receive it as a parameter
        [HttpPost]
        [Route("api/ListFriends")]
        public JsonResult ListFriends([FromBody] dynamic payload)
        {
            var arrayParticipants = this._participantService.GetAllParticipantChat((string)payload.currentUserId);
            JsonResult json = new JsonResult(GroupChatHub.ConnectedParticipants((string)payload.currentUserId, arrayParticipants));
            return json;


            //_session.SetString("userId", (string)payload.currentUserId);
            //var lstResult = this._participantService.GetAllParticipantChat((string)payload.currentUserId);
            //JsonResult json = new JsonResult(GroupChatHub.ConnectedParticipants((string)payload.currentUserId).ToList());
            //return json;

            // Use the following for group chats
            // Make sure you have [pollFriendsList] set to true for this simple group chat example to work as
            // broadcasting with group was not implemented here
            // return Json(GroupChatHub.ConnectedParticipants((string)payload.currentUserId));
        }

        [HttpPost]
        [Route("api/UploadFile")]
        public async Task<ActionResult> UploadFile(IFormFile file, [FromForm(Name = "ng-chat-participant-id")] string userId)
        {
            // Storing file in temp path
            var filePath = Path.Combine(Path.GetTempPath(), file.FileName);

            if (file.Length > 0)
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
            }

            var baseUri = new Uri($"{Request.Scheme}://{Request.Host}{Request.PathBase}");
            var fileUri = new Uri(baseUri, $"api/Uploads/{file.FileName}");

            return Ok(new
            {
                type = 2, // MessageType.File = 2
                //fromId: ngChatSenderUserId, fromId will be set by the angular component after receiving the http response
                toId = userId,
                message = file.FileName,
                mimeType = file.ContentType,
                fileSizeInBytes = file.Length,
                downloadUrl = fileUri.ToString()
            });
        }

        [HttpPost]
        [Route("api/Uploads/{fileName}")]
        public async Task<IActionResult> Uploads(string fileName)
        {
            var filePath = Path.Combine(Path.GetTempPath(), fileName);

            var memory = new MemoryStream();

            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                if (stream == null)
                    return NotFound();

                await stream.CopyToAsync(memory);
            }

            memory.Position = 0;

            return File(memory, "application/octet-stream");
        }


        [Route("api/Save/Message")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] MessageViewModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _messageService.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MessageHistory")]
        [HttpGet]
        public MethodResponse<List<MessageViewModel>> GetMessageHistory(string fromId, string toId)
        {
            var result = new MethodResponse<List<MessageViewModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _messageService.GetMessageHistory(fromId, toId).ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }


        [Route("api/UpdateStatus")]
        [HttpGet]
        public MethodResponse<bool> UpdateStatus(string userId, int status)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                result.Result = _participantService.UpdateStatusParticipantChat(userId, status);
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