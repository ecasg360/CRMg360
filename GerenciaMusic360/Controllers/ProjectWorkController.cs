using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Implementations;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectWorkController : ControllerBase
    {
        private readonly IProjectWorkService _projectWorkService;
        private readonly IWorkCollaboratorService _workCollaborator;
        private readonly IComposerDetailService _composerDetailService;
        private readonly IProjectService _projectService;
        private readonly IProjectWorkAdminService _projectWorkAdminService;
        private readonly ITrackService _trackService;
        private readonly ITrackWorkService _trackWorkService;
        private readonly IWorkRecordingService _workRecording;
        private readonly IPersonService _personService;
        private readonly IWorkService _workService;
        private readonly IWorkPublisherService _workPublisherService;
        private readonly IPublisherService _publisherService;

        public ProjectWorkController(
            IProjectWorkService projectWorkService,
            IWorkCollaboratorService workCollaborator,
            IComposerDetailService composerDetailService,
            IProjectService projectService,
            IProjectWorkAdminService projectWorkAdminService,
            ITrackService trackService,
            ITrackWorkService trackWorkService,
            IWorkRecordingService workRecording,
            IPersonService personService,
            IWorkService workService,
            IWorkPublisherService workPublisherService,
            IPublisherService publisherService
        )
        {
            _projectWorkService = projectWorkService;
            _workCollaborator = workCollaborator;
            _composerDetailService = composerDetailService;
            _projectService = projectService;
            _projectWorkAdminService = projectWorkAdminService;
            _trackService = trackService;
            _trackWorkService = trackWorkService;
            _workRecording = workRecording;
            _personService = personService;
            _workService = workService;
            _workPublisherService = workPublisherService;
            _publisherService = publisherService;
        }

        [Route("api/ProjectWorks")]
        [HttpGet]
        public MethodResponse<List<ProjectWork>> Get(int projectId)
        {
            var result = new MethodResponse<List<ProjectWork>> { Code = 100, Message = "Success", Result = null };
            try
           {
                var projectworks = _projectWorkService.GetProjectWorksByProject(projectId)
                    .ToList();

                List<Editoras> editoras = new List<Editoras>();

                foreach (var item in projectworks)
                {
                    var workCollaborators = _workCollaborator.GetWorkCollaboratorsByWorkComposer(item.ItemId);
                    var workRecordings = _workRecording.GetAllWorkRecordings(item.ItemId);

                    item.ProjectWorkAdmin = _projectWorkAdminService.GetProjectWorksAdminByProjectWork(item.Id).ToList();
                    if (item.ProjectWorkAdmin.Count > 0)
                    {
                        item.PercentageAdminTotal = item.ProjectWorkAdmin.Sum(x => x.Percentage);
                        item.PercentageAdminLeft = (100 - item.ProjectWorkAdmin.Sum(x => x.Percentage));
                    }
                    else
                    {
                        item.PercentageAdminTotal = 0;
                        item.PercentageAdminLeft = 100;
                    }

                    if (workCollaborators != null)
                    {
                        editoras = new List<Editoras>();
                        foreach (var detail in workCollaborators)
                        {
                            detail.ComposerDetail = new ComposerDetail();
                            detail.ComposerDetail = _composerDetailService.GetComposerDetailsByComposerId(detail.ComposerId);

                            if (detail.ComposerDetail != null)
                            {
                                var find = editoras.FindIndex(x => x.key == detail.ComposerDetail.Editor.Dba);
                                if (find == -1)
                                {
                                    if (detail.ComposerDetail != null)
                                    {
                                        editoras.Add(new Editoras { key = detail.ComposerDetail.Editor.Dba, value = 1 });
                                    }
                                }
                                else
                                {
                                    editoras[find].value++;
                                }
                            }
                        }

                        foreach (var e in editoras)
                        {
                            e.percent = (e.value * 100) / workCollaborators.Count();
                        }
                    }

                    if (workRecordings != null)
                    {
                        foreach (var recording in workRecordings)
                        {
                            recording.Detail = new Person();
                            recording.Detail = _personService.GetPerson(recording.ArtistId);
                        }
                    }

                    item.Editoras = editoras;
                    item.WorkCollaborators = workCollaborators.ToList();
                    item.PercentageRevenueTotal = workCollaborators.Sum(x => x.PercentageRevenue);
                    item.PercentageRevenueLeft = 100 - item.PercentageRevenueTotal;
                    item.WorkRecordings = workRecordings.ToList();

                    item.Work = _workService.GetWorkRelation(item.WorkId);
                    if(item.PersonRemixId !=null)
                        item.MixMaster = _personService.GetPerson(item.PersonRemixId.GetValueOrDefault());

                    if (item.PersonProducerId !=null)
                        item.Producer = _personService.GetPerson(item.PersonProducerId.GetValueOrDefault());
                }

                result.Result = projectworks;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWorksByProjects")]
        [HttpGet]
        public MethodResponse<List<ProjectWork>> GetProjectWorksByProjects()
        {
            var result = new MethodResponse<List<ProjectWork>> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectWorkService.GetProjectWorksByProjectType()
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

        [Route("api/ProjectWorkByISRC")]
        [HttpGet]
        public MethodResponse<ProjectWork> GetProjectWorkByISRC(string ISRC)
        {
            var result = new MethodResponse<ProjectWork> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _projectWorkService.GetProjectWorkByISRC(ISRC);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/ProjectWork")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] ProjectWork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                List<ProjectWork> modelNew = new List<ProjectWork>();
                var works = _projectWorkService.GetProjectWorksByProject(model.ProjectId);

                var find = works.Where(x => x.ItemId == model.ItemId && x.ISRC == model.ISRC).ToList();
                if (find.Count() == 0)
                {
                    _projectWorkService.CreateProjectWork(model);
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

        [Route("api/ProjectWorks")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] List<ProjectWork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                List<ProjectWork> modelNew = new List<ProjectWork>();
                var works = _projectWorkService.GetProjectWorksByProject(model[0].ProjectId);

                foreach (var item in model)
                {
                    var find = works.SingleOrDefault(x => x.ItemId == item.ItemId);
                    if (find == null)
                    {
                        modelNew.Add(item);
                    }
                }

                _projectWorkService.CreateProjectWorks(modelNew);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectWork")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] ProjectWork model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                _projectWorkService.UpdateProjectWorks(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectWorks")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] List<ProjectWork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                List<ProjectWork> modelNew = new List<ProjectWork>();
                List<ProjectWork> modelCurrent = new List<ProjectWork>();
                var works = _projectWorkService.GetProjectWorksByProject(model[0].ProjectId);

                foreach (var item in model)
                {
                    var find = works.SingleOrDefault(x => x.ItemId == item.ItemId);
                    if (find == null)
                    {
                        modelNew.Add(item);
                    } else
                    {
                        modelCurrent.Add(item);
                    }
                }

                _projectWorkService.CreateProjectWorks(modelNew);
                foreach (var theModel in modelCurrent)
                {
                    _projectWorkService.UpdateProjectWorks(theModel);
                }

                foreach (var work in model)
                {
                    var composers = work.ComposersList.Split(",");
                    IEnumerable<WorkCollaborator> workCollaborators = _workCollaborator.GetWorkCollaboratorsByWork(work.ItemId);
                    foreach (var composer in composers)
                    {
                        var exists = false;
                        foreach (var workC in workCollaborators)
                        {
                            if (composer == workC.ComposerId.ToString())
                            {
                                exists = true;
                            }
                        }
                        if (!exists)
                        {
                            WorkCollaborator newComposer = new WorkCollaborator
                            {
                                WorkId = work.ItemId,
                                ComposerId = Int32.Parse(composer),
                                PercentageRevenue = 0
                            };
                            _workCollaborator.CreateWorkCollaborator(newComposer);
                        }
                    }
                    
                    var publishers = work.PublishersList.Split(",");
                    IEnumerable<WorkPublisher> workPublishers = _workPublisherService.GetWorkPublisherByWork(work.ItemId);
                    foreach (var publisher in publishers)
                    {
                        var exists = false;
                        foreach (var workP in workPublishers)
                        {
                            if (publisher == workP.PublisherId.ToString())
                            {
                                exists = true;
                            }
                        }
                        if (!exists)
                        {
                            Publisher publisherInfo = _publisherService.GetPublisher(Int32.Parse(publisher));
                            WorkPublisher newPublisher = new WorkPublisher
                            {
                                WorkId = work.ItemId,
                                PublisherId = Int32.Parse(publisher),
                                PercentageRevenue = 0,
                                AssociationId = publisherInfo.AssociationId
                            };
                            _workPublisherService.CreateWorkPublisher(newPublisher);
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

        [Route("api/ProjectWork")]
        [HttpDelete]
        public MethodResponse<bool> Delete(int id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectWork ProjectWork = _projectWorkService.GetProjectWork(id);
                _projectWorkService.DeleteProjectWork(ProjectWork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectWorks")]
        [HttpDelete]
        public MethodResponse<bool> DeleteByProject(int projectId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                IEnumerable<ProjectWork> ProjectWorks = _projectWorkService.GetProjectWorksByProject(projectId);
                _projectWorkService.DeleteProjectWorks(ProjectWorks);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/DeleteProjectWork")]
        [HttpDelete]
        public MethodResponse<bool> DeleteProjectWork(int projectId, int workId)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                ProjectWork ProjectWork = _projectWorkService.GetByProjectAndWork(projectId, workId);
                _projectWorkService.DeleteProjectWork(ProjectWork);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/ProjectWorksTracks")]
        [HttpPost]
        public MethodResponse<bool> ProjectWorksTracks([FromBody] List<ProjectWork> model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                List<ProjectWork> modelNew = new List<ProjectWork>();

                foreach (var item in model)
                {
                    var works = _projectWorkService.GetProjectWorksByProject(item.ProjectId);

                    var find = works.Where(x => x.ItemId == item.ItemId && x.ISRC == item.ISRC).ToList();
                    if (find.Count() == 0)
                    {
                        var projectWork = _projectWorkService.Create(item);
                        if (projectWork.Id > 0)
                        {
                            string userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                            Track track = new Track
                            {
                                WorkId = projectWork.ItemId,
                                ProjectId = projectWork.ProjectId,
                                Name = projectWork.TrackName,
                                NumberTrack = projectWork.NumberTrack,
                                StatusRecordId = 1,
                                Created = DateTime.Now,
                                Creator = userId
                            };

                            var modelTrack = _trackService.Create(track);

                            if (modelTrack.Id > 0)
                            {
                                TrackWork trackWork = new TrackWork
                                {
                                    TrackId = modelTrack.Id,
                                    ISRC = projectWork.ISRC
                                };

                                var modelTrackWork = _trackWorkService.Create(trackWork);

                                if (modelTrackWork.Id > 0)
                                {
                                    result.Result = true;
                                }

                            }
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