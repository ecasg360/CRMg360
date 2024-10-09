using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class CalendarService : Repository<Calendar>, ICalendarService
    {
        public CalendarService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public Calendar CreateCalendarEvent(Calendar calendar) =>
        Add(calendar);

        public void CreateCalendarEvents(List<Calendar> calendars) =>
        AddRange(calendars);

        public IEnumerable<Calendar> GetAllCalendarEvents()
        {
            DbCommand cmd = LoadCmd("GetAllCalendarEvents");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetAllCalendarEvents(int userId)
        {
            DbCommand cmd = LoadCmd("GetCalendarEventsByUser");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetByLabel(int userId)
        {
            DbCommand cmd = LoadCmd("GetCalendarEventsByLabel");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetByEvent(int userId)
        {
            DbCommand cmd = LoadCmd("GetCalendarEventsByEvent");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetByAgency(int userId)
        {
            DbCommand cmd = LoadCmd("GetCalendarEventsByAgency");
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetCalendarEventsByProject(int projectId, long userId)
        {
            DbCommand cmd = LoadCmd("GetCalendarEventsByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            cmd = AddParameter(cmd, "UserId", userId);
            return ExecuteReader(cmd);
        }

        public Calendar GetCalendarEvent(int id)
        {
            DbCommand cmd = LoadCmd("GetCalendarEvent");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public void UpdateCalendarEvent(Calendar calendar) =>
        Update(calendar, calendar.Id);

        public IEnumerable<Calendar> GetCalendarByUser(long userId, int taskId) =>
        FindAll(w => w.ProjectTaskId == taskId & w.PersonId == userId & w.Checked == 0 & w.StatusRecordId == 1);

        public void InsertEvent(int projectId, string title, DateTime startDate, string user)
        {
            DbCommand cmd = LoadCmd("InsertEvent");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            cmd = AddParameter(cmd, "Title", title);
            cmd = AddParameter(cmd, "StartDate", startDate);
            cmd = AddParameter(cmd, "User", user);
            ExecuteReader(cmd);
        }

        public IEnumerable<Calendar> GetCalendarByProjectTask(int taskId) => FindAll(w => w.ProjectTaskId == taskId);

        public void DeleteEvents(IEnumerable<Calendar> events) => DeleteRange(events);

        public IEnumerable<Calendar> GetCalendarReleasesProjects()
        {
            DbCommand cmd = LoadCmd("GetCalendarReleasesProjects");
            return ExecuteReader(cmd);
        }
    }
}
