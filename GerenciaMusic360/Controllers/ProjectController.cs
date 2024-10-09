using AutoMapper;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IProjectService _projectService;
        private readonly IProjectTaskAutorizeService _projectAutorizeService;
        private readonly IProjectTaskService _projectTaskService;
        private readonly IProjectStateService _projectState;
        private readonly IUserProfileService _userProfileService;
        private readonly IConfigurationProjectTOwnerService _configurationProjectTOwnerService;
        private readonly IHostingEnvironment _env;
        private readonly IHelperService _helperService;
        private readonly IContractService _contractService;
        private readonly IContractStatusService _contractStatusService;
        private readonly IPersonService _personService;
        private readonly ICalendarService _calendarService;

        public ProjectController(
            IProjectService projectService,
            IProjectTaskAutorizeService projectAutorizeService,
            IProjectTaskService projectTaskService,
            IProjectStateService projectState,
            IUserProfileService userProfileService,
            IConfigurationProjectTOwnerService configurationProjectTOwnerService,
            IHostingEnvironment env,
            IHelperService helperService,
            IContractService contractService,
            IContractStatusService contractStatusService,
            IPersonService personService,
            ICalendarService calendarService)
        {
            _projectService = projectService;
            _projectAutorizeService = projectAutorizeService;
            _projectTaskService = projectTaskService;
            _projectState = projectState;
            _userProfileService = userProfileService;
            _configurationProjectTOwnerService = configurationProjectTOwnerService;
            _env = env;
            _helperService = helperService;
            _contractService = contractService;
            _contractStatusService = contractStatusService;
            _personService = personService;
            _calendarService = calendarService;
        }

        [Route("api/Projects")]
        [HttpGet]
        public MethodResponse<IEnumerable<Project>> Get()
        {
            var result = new MethodResponse<IEnumerable<Project>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<Project> lstProject = _projectService.GetAllProjects().ToList();
                List<ProjectModel> projects = new List<ProjectModel>();
                Mapper.Reset();
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Project, ProjectModel>();
                });
                projects = Mapper.Map<List<ProjectModel>>(lstProject);
                foreach (ProjectModel project in projects)
                {
                    project.ProjectTaskAutorizes =
                    _projectAutorizeService.GetProjectTaskAutorizeByProject(project.Id)
                    .ToList();
                }

                result.Result = projects;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Project")]
        [HttpGet]
        public MethodResponse<Project> Get(int id)
        {
            var result = new MethodResponse<Project> { Code = 100, Message = "Success", Result = null };
            try
            {
                var project = _projectService.GetProject(id);
                Mapper.Reset();
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Project, ProjectModel>();
                });
                var projectModel = Mapper.Map<ProjectModel>(project);
                projectModel.ProjectTaskAutorizes = _projectAutorizeService.GetProjectTaskAutorizeByProject(id)
                    .ToList();
                result.Result = projectModel;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectsForAssign")]
        [HttpGet]
        public MethodResponse<List<Project>> GetForAssign()
        {
            var result = new MethodResponse<List<Project>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectService.GetProjectsForAssign()
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

        [Route("api/Project")]
        [HttpPost]
        public MethodResponse<Project> Post([FromBody] Project model)
        {
            var result = new MethodResponse<Project> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset")) {
                    model.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "project", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                ConfigurationProjectTypeOwner configuration = _configurationProjectTOwnerService
                    .GetConfigurationProjectTypeOwne(model.ProjectTypeId);

                model.Created = DateTime.Now;
                model.Creator = userId;
                model.StatusRecordId = 1;
                model.BudgetSpent = 0;
                model.OwnerId = configuration.DefaultProjectOwnerId;
                result.Result = _projectService.Create(model);
                SetStateProject(result.Result.Id, 1);

                if (model.ProjectTypeId == 5 || model.ProjectTypeId == 6)
                {
                    //SaveContract(model);
                    SaveEvent(result.Result, userId);
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

        [Route("api/Project")]
        [HttpPut]
        public MethodResponse<Project> Put([FromBody] Project model)
        {
            var result = new MethodResponse<Project> { Code = 100, Message = "Success", Result = null };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Project project = _projectService.GetProject(model.Id);

                if (!string.IsNullOrWhiteSpace(model.PictureUrl) && !model.PictureUrl.Contains("asset"))
                {
                    if (project.PictureUrl != null)
                    {
                        if (System.IO.File.Exists(Path.Combine(_env.WebRootPath, "clientapp", "dist", project.PictureUrl)))
                            System.IO.File.Delete(Path.Combine(_env.WebRootPath, "clientapp", "dist", project.PictureUrl));
                    }

                    project.PictureUrl = _helperService.SaveImage(
                        model.PictureUrl.Split(",")[1],
                        "project", $"{Guid.NewGuid()}.jpg",
                        _env);
                }

                project.Name = model.Name;
                project.Description = model.Description;
                project.InitialDate = model.InitialDate;
                project.EndDate = model.EndDate;
                project.Modified = DateTime.Now;
                project.Modifier = userId;
                project.ArtistId = model.ArtistId;
                project.UPCCode = model.UPCCode;
                project.TotalBudget = model.TotalBudget;
                project.LocationId = model.LocationId;
                project.Venue = model.Venue;
                project.Deposit = model.Deposit;
                project.DepositDate = model.DepositDate;
                project.LastPayment = model.LastPayment;
                project.LastPaymentDate = model.LastPaymentDate;

                result.Result = _projectService.Update(project);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Project project = _projectService.GetProject(Convert.ToInt32(model.Id));
                project.StatusRecordId = model.Status;
                project.Modified = DateTime.Now;
                project.Modifier = userId;
                _projectService.Update(project);
                if (model.Status == 2)
                {
                    CancelProjectTask(project.Id);
                    SetStateProject(project.Id, 5);
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

        [Route("api/Project")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                Project project = _projectService.GetProject(id);
                project.StatusRecordId = 3;
                project.Erased = DateTime.Now;
                project.Eraser = userId;

                _projectService.Update(project);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectsActive")]
        [HttpGet]
        public MethodResponse<IEnumerable<Project>> GetProjectsActive()
        {
            var result = new MethodResponse<IEnumerable<Project>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectService.GetProjectsTasks();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        private void SetStateProject(int projectId, short status)
        {
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
            UserProfile userProfile = _userProfileService.GetUserByUserId(userId);

            _projectState.Create(new ProjectState
            {
                StatusProjectId = status,
                Date = DateTime.Now,
                Created = DateTime.Now,
                Creator = userId,
                ProjectId = projectId,
                ApproverUserId = userProfile.Id,
                Notes = ""
            });
        }

        private void CancelProjectTask(int projectId)
        {
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
            _projectTaskService.CancelProjectTaskByProject(projectId, userId);
        }
        [Route("api/ProjectsAnalistics")]
        [HttpGet]
        public MethodResponse<IEnumerable<Project>> Get(int month, int year)
        {
            var result = new MethodResponse<IEnumerable<Project>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<Project> lstProject = _projectService.GetAllProjects()
                    .Where(p => p.InitialDate.Month == month && p.InitialDate.Year == year)
                    .ToList();
                var mes = lstProject.Where(i => i.InitialDate.Month == 8).ToList();
                List<ProjectModel> projects = new List<ProjectModel>();
                Mapper.Reset();
                Mapper.Initialize(cfg =>
                {
                    cfg.CreateMap<Project, ProjectModel>();
                });
                projects = Mapper.Map<List<ProjectModel>>(lstProject);
                foreach (ProjectModel project in projects)
                {
                    project.ProjectTaskAutorizes =
                    _projectAutorizeService.GetProjectTaskAutorizeByProject(project.Id)
                    .ToList();
                }

                result.Result = projects;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        private void SaveContract(Project model)
        {
            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
            string contractName = model.ProjectTypeId == 5 ? "Evento" : "Venta";
            Person artist = _personService.GetPerson((int)model.ArtistId);
            UserProfile user = _userProfileService.GetUserByUserId(userId);

            Contract contract = _contractService.CreateContract(new Contract
            {
                StartDate = model.InitialDate,
                EndDate = model.InitialDate,
                Name = $"{contractName} de Artista",
                Description = $"{contractName} de Artista",
                LocalCompanyId = 2,
                ContractTypeId = 5,
                HasAmount = true,
                Amount = (decimal)model.TotalBudget,
                CurrencyId = model.CurrencyId,
                Created = DateTime.Now,
                Creator = userId
            });

            _contractStatusService.CreateContractStatus(new ContractStatus
            {
                ContractId = contract.Id,
                Date = DateTime.Now,
                StatusId = 1,
                Created = DateTime.Now,
                Creator = userId,
                Notes = string.Empty,
                UserVerificationId = (int)user.Id
            });
        }

        private void SaveEvent(Project project, string user)
        {
            Person person = _personService.GetPerson((int)project.ArtistId);
            string name = string.IsNullOrEmpty(person.AliasName) ? $"{person.Name} {person.LastName}" : person.AliasName;
            _calendarService.InsertEvent(
                project.Id,
                $"{project.Name} ({name})",
                project.InitialDate,
                user);
        }

    }
}
