using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class ProjectContractController : ControllerBase
    {
        private readonly IProjectWorkService _projectWorkService;
        private readonly IWorkCollaboratorService _workCollaborator;
        private readonly IComposerDetailService _composerDetailService;
        private readonly IProjectService _projectService;
        private readonly IContractService _contractService;
        private readonly IContractTypeService _contractTypeService;
        private readonly IContractStatusService _contractStatusService;
        private readonly IConfigurationProjectTaskContractService _configurationProjectTaskContractService;

        public ProjectContractController(
            IProjectWorkService projectWorkService,
            IWorkCollaboratorService workCollaborator,
            IComposerDetailService composerDetailService,
            IProjectService projectService,
            IContractService contractService,
            IContractTypeService contractTypeService,
            IContractStatusService contractStatusService,
            IConfigurationProjectTaskContractService configurationProjectTaskContractService
            )
        {
            _projectWorkService = projectWorkService;
            _workCollaborator = workCollaborator;
            _composerDetailService = composerDetailService;
            _projectService = projectService;
            _contractService = contractService;
            _contractStatusService = contractStatusService;
            _contractTypeService = contractTypeService;
            _configurationProjectTaskContractService = configurationProjectTaskContractService;
        }

        [Route("api/ProjectContracts")]
        [HttpGet]
        public MethodResponse<List<ProjectContractModel>> Get(int projectId)
        {
            var result = new MethodResponse<List<ProjectContractModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                List<ProjectContractModel> list = new List<ProjectContractModel>();

                var project = _projectService.GetProject(projectId);
                var configuration = _configurationProjectTaskContractService.GetAllByProjectTypeId(project.ProjectTypeId);

                var projectworks = _projectWorkService.GetProjectWorksByProject(projectId)
                    .ToList();

                foreach (var item in projectworks)
                {
                    var workCollaborators = _workCollaborator.GetWorkCollaboratorsByWorkComposer(item.ItemId);
                    if (workCollaborators != null)
                    {
                        ProjectContractModel pcm = new ProjectContractModel();
                        pcm.projectWorks = new List<ProjectWork>();
                        foreach (var detail in workCollaborators)
                        {
                            pcm.Id = detail.ComposerId;
                            pcm.Name = string.Format("{0} {1}", detail.Composer.Name, detail.Composer.LastName);
                            pcm.PictureUrl = detail.Composer.PictureUrl;
                            pcm.projectWorks.Add(item);
                            pcm.Type = "Compositor";
                            //pcm.contractType = _contractTypeService.GetContractType() establecer un contrato de compositor
                            list.Add(pcm);

                            detail.ComposerDetail = _composerDetailService.GetComposerDetailsByComposerId(detail.ComposerId);
                            ProjectContractModel projectcontract = new ProjectContractModel();

                            var find = list.FindIndex(x => x.Name == detail.ComposerDetail.Editor.Dba);
                            if (find == -1)
                            {
                                projectcontract.Id = detail.ComposerDetail.Id;
                                projectcontract.Name = detail.ComposerDetail.Editor.Dba;
                                projectcontract.PictureUrl = null;
                                projectcontract.projectWorks = new List<ProjectWork>();
                                projectcontract.Type = "Productor";
                                projectcontract.projectWorks.Add(item);
                                list.Add(projectcontract);
                            }
                            else
                            {
                                list[find].projectWorks.Add(item);
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
