using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Services.Implementations;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.Extensions.Logging;
using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GerenciaMusic360.Tasks
{
    public class TasksReminder : IJob
    {
        private readonly ILogger<TasksReminder> _logger;
        //private readonly IProjectService _projectService;

        public TasksReminder(
            ILogger<TasksReminder> logger
            //IProjectService projectService//,
            //IProjectTaskService projectTaskService
        )
        {
            _logger = logger;
            //_projectService = projectService;
            //this._projectTaskService = projectTaskService;
        }

        public Task Execute(IJobExecutionContext context)
        {
            try
            {
                
                /*
                var dataMap = context.JobDetail.JobDataMap;
                var timeRequested = dataMap.GetDateTime("Current Date Time");
                var ticketsNeeded = dataMap.GetInt("Tickets needed");
                var concertName = dataMap.GetString("Concert Name");
                Debug.WriteLine($"{ticketsNeeded} Tickets to the {concertName} concert on {timeRequested.ToString("MM-dd-yyyy")} are available");
                */
                _logger.LogInformation($"ESR Job TasksReminder Starting at {DateTime.Now}");
                //List<Project> projects = _projectService.GetProjectsTasks().ToList();
                //Context_DB repository_context = new Context_DB();
                //ProjectService projectService = new ProjectService(repository_context);
                //List<Project> projects = _projectService.GetAllProjects().ToList();
                //_projectTaskService.GetProjectTaskByProject();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return Task.FromResult(0);
        }
    }
}
