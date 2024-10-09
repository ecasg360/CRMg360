using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectArtistController : ControllerBase
    {
        private readonly IProjectArtistService _projectArtistService;
        private readonly IProjectService _projectService;
        private readonly IMarketingService _marketingService;

        public ProjectArtistController(
            IProjectArtistService projectArtistService,
            IProjectService projectService,
            IMarketingService marketingService
        )
        {
            _projectArtistService = projectArtistService;
            _projectService = projectService;
            _marketingService = marketingService;
        }

        [Route("api/ProjectArtists")]
        [HttpGet]
        public MethodResponse<List<ProjectArtist>> Get(int projectId)
        {
            var result = new MethodResponse<List<ProjectArtist>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectArtistService.GetByProject(projectId)
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

        [Route("api/ProjectArtists")]
        [HttpPost]
        public MethodResponse<List<ProjectArtist>> Post([FromBody] List<ProjectArtist> model)
        {
            var result = new MethodResponse<List<ProjectArtist>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectArtistService.Create(model)
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

        [Route("api/ProjectArtist")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                ProjectArtist projectArtist = _projectArtistService.Get(id);
                _projectArtistService.Delete(projectArtist);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectArtistById")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByArtistId(int Id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                ProjectArtist projectArtist = _projectArtistService.GetByArtistId(Id);
                if (projectArtist != null)
                _projectArtistService.Delete(projectArtist);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectArtists")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByProject(int projectId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                IEnumerable<ProjectArtist> projectArtists = _projectArtistService.GetByProject(projectId);
                _projectArtistService.Delete(projectArtists);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectArtistTracks")]
        [HttpGet]
        public MethodResponse<List<Marketing>> GetProjectArtistTrack(int artistId)
        {
            var result = new MethodResponse<List<Marketing>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<Marketing> list = new List<Marketing>(0);
                List<Project> listProjects = new List<Project>(0);
                IEnumerable<Project> projects = _projectService.GetProjectByArtist(artistId);
                if (projects != null)
                {
                    foreach (Project project in projects)
                    {
                        listProjects.Add(project);
                    }
                    foreach(Project project in listProjects)
                    {
                        IEnumerable<Marketing> campaigns = _marketingService.GetByProject(project.Id);
                        if (campaigns.Count() > 0)
                        {
                            foreach (Marketing campaign in campaigns)
                            {
                                list.Add(campaign);
                            }
                        }
                    }
                }
                
                result.Result = list;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }
    }
}