using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Threading.Tasks;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IFileService _fileService;
        private readonly IHelperService _helperService;
        private readonly IHostingEnvironment _env;
        private readonly IModuleService _moduleService;

        public FileController(IFileService fileService, IHelperService helperService, IHostingEnvironment env, IModuleService moduleService)
        {
            _fileService = fileService;
            _helperService = helperService;
            _env = env;
            _moduleService = moduleService;
        }

        enum Modules
        {
            Marketing = 3,
        }

        [Route("api/Files")]
        [HttpGet]
        public MethodResponse<List<Files>> Get()
        {
            var result = new MethodResponse<List<Files>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _fileService.GetAllFiles()
                    .ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/File")]
        [HttpGet]
        public MethodResponse<Files> Get(int id)
        {
            var result = new MethodResponse<Files> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _fileService.GetFile(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/File")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Files model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string moduleName = "others";
                Module module = _moduleService.GetModule(model.ModuleId);

                if (module != null)
                    moduleName = module.Name;

                var list = _fileService.GetFiles(model.ModuleId, model.RowId);
                //Delete previous File
                foreach (var file in list)
                {
                    _helperService.DeleteFile(moduleName, file.FileName, _env);
                    var fileToDelete = _fileService.GetFileByName(file.FileName);
                    _fileService.DeleteFile(fileToDelete);
                }

                string name = $"{Guid.NewGuid()}" + model.FileExtention;

                string fileURL = string.Empty;
                if (model != null)
                    fileURL = _helperService.SaveFile(
                        model.FileURL.Split(",")[1],
                        moduleName, name,
                        _env);

                if (fileURL.Length > 0)
                {
                    using (MD5 md5Hash = MD5.Create())
                    {
                        string hash = _helperService.GetMd5Hash(md5Hash, name);
                        model.Hash = hash;
                    }

                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                    model.FileName = name;
                    model.Path = fileURL;
                    model.Created = DateTime.Now;
                    model.Creator = userId;
                    model.StatusRecordId = 1;

                    Files obj = _fileService.CreateFile(model);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }


        [Route("api/File")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Files model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                //Get Name Module
                string moduleName = "others";
                Module module = _moduleService.GetModule(model.ModuleId);

                if (module != null)
                    moduleName = module.Name;

                var list = _fileService.GetFiles(model.ModuleId, model.RowId).ToList();
                //Delete previous File
                foreach (var file in list)
                {
                    _helperService.DeleteFile(moduleName, file.FileName, _env);

                    if (list.Count() > 1)
                    {
                        var fileToDelete = _fileService.GetFileByName(file.FileName);
                        _fileService.DeleteFile(fileToDelete);
                        list.Remove(file);
                    }
                }

                //Name New File
                string name = $"{Guid.NewGuid()}" + model.FileExtention;

                //Get Url and Create File
                string fileURL = string.Empty;
                if (model != null)
                    fileURL = _helperService.SaveFile(
                        model.FileURL.Split(",")[1],
                        moduleName, name,
                        _env);

                if (fileURL.Length > 0)
                {
                    using (MD5 md5Hash = MD5.Create())
                    {
                        string hash = _helperService.GetMd5Hash(md5Hash, name);
                        model.Hash = hash;
                    }

                    string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                    Files file = _fileService.GetFile(model.ModuleId, model.RowId);

                    file.FileName = name;
                    file.Path = fileURL;
                    file.Hash = model.Hash;
                    file.Modified = DateTime.Now;
                    file.Modifier = userId;

                    _fileService.UpdateFile(file);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/FileStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Files file = _fileService.GetFile(Convert.ToInt32(model.Id));
                file.StatusRecordId = model.Status;
                file.Modified = DateTime.Now;
                file.Modifier = userId;

                _fileService.UpdateFile(file);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/File")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int ModuleId, int RowId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                IEnumerable<Files> listFile = _fileService.GetFiles(ModuleId, RowId);

                foreach (Files file in listFile)
                {
                    _fileService.DeleteFile(file);
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [HttpPost]
        [Route("api/Marketing/Upload/{marketingId}")]
        public async Task<IActionResult> PostFile([FromRoute] int marketingId)
        {
            var files = Request.Form.Files;

            foreach (var file in files)
            {
                var filename = ContentDispositionHeaderValue
                              .Parse(file.ContentDisposition)
                              .FileName
                              .Trim('"');

                var pathProd = Path.Combine("clientapp", "dist");
                var path = Path.Combine("assets", "files", "marketing", marketingId.ToString());

                Files exists = _fileService.GetFileByModuleAndNameActive(3, marketingId, filename);

                if (exists == null)
                {
                    if (!Directory.Exists(Path.Combine(_env.WebRootPath, pathProd, path)))
                        Directory.CreateDirectory(Path.Combine(_env.WebRootPath, pathProd, path));

                    var savePath = Path.Combine(_env.WebRootPath, pathProd, path, filename);

                    using (var fileStream = new FileStream(savePath, FileMode.Create))
                    {
                        //REGISTRO EN TABLA FILES
                        //string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                        Files model = new Files();
                        model.ModuleId = 3; //Id de Marketing
                        model.RowId = marketingId;
                        model.FileName = filename;
                        model.Path = pathProd + path;

                        using (MD5 md5Hash = MD5.Create())
                        {
                            string hash = _helperService.GetMd5Hash(md5Hash, filename);
                            model.Hash = hash;
                        }

                        model.Created = DateTime.Now;
                        model.Creator = "SYSTEM";
                        model.StatusRecordId = 1;

                        Files obj = _fileService.CreateFile(model);

                        await file.OpenReadStream().CopyToAsync(fileStream);
                    }

                    return Created(savePath, file);
                } else
                {
                    return NotFound();
                }
                                
            }
            return Ok();
        }

        [HttpGet]
        [Route("api/MarketingFiles")]
        public MethodResponse<IEnumerable<object>> GetFiles(int marketingId)
        {
            var result = new MethodResponse<IEnumerable<object>> { Code = 200, Message = "Success", Result = null };
            try
            {
                var pathProd = Path.Combine("clientapp", "dist");
                var path = Path.Combine("assets", "files", "marketing", marketingId.ToString());


                if (Directory.Exists(Path.Combine(_env.WebRootPath, pathProd, path)))
                {
                    var pathMarketing = Path.Combine(_env.WebRootPath, pathProd, path);

                    DirectoryInfo d = new DirectoryInfo(pathMarketing);//Assuming Test is your Folder
                    var Files = d.GetFiles().Select(a => new
                    {
                        a.Extension,
                        a.Name,
                        a.FullName,
                        a.DirectoryName,
                        isImage = (a.Extension.ToString().ToUpper().Contains("PNG")
                                         || a.Extension.ToString().ToUpper().Contains("JPG")
                                         || a.Extension.ToString().ToUpper().Contains("JPEG")
                                         || a.Extension.ToString().ToUpper().Contains("GIF")
                                         || a.Extension.ToString().ToUpper().Contains(".TIFF")
                                         || a.Extension.ToString().ToUpper().Contains(".TIF")
                                         || a.Extension.ToString().ToUpper().Contains(".BMP") ? true : false)
                    }).ToArray();
                    result.Code = 100;
                    result.Result = Files;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Marketing/File/Delete")]
        [HttpDelete]
        public MethodResponse<bool> MarketingFileDelete(string fileName, int marketingId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var path = Path.Combine(_env.WebRootPath, "clientapp", "dist", "assets", "files", "marketing", marketingId.ToString());

                if (Directory.Exists(path))
                {
                    var file = System.IO.Path.Combine(path, fileName);

                    if (System.IO.File.Exists(file))
                    {
                        //Eliminado Fisico
                        System.IO.File.Delete(file);

                        //Eliminado Logico
                        Files File = _fileService.GetFileByModuleAndNameActive(3, marketingId, fileName);
                        if (File.Id > 0)
                        {
                            File.StatusRecordId = 3;
                            File.Modified = DateTime.Now;
                            File.Modifier = "SYSTEM";
                            _fileService.UpdateFile(File);
                        }
                    }
                }
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