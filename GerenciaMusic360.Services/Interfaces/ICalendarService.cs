using GerenciaMusic360.Entities;
using System;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICalendarService
    {
        IEnumerable<Calendar> GetAllCalendarEvents();
        IEnumerable<Calendar> GetAllCalendarEvents(int userId);
        IEnumerable<Calendar> GetByLabel(int userId);
        IEnumerable<Calendar> GetByEvent(int userId);
        IEnumerable<Calendar> GetByAgency(int userId);
        IEnumerable<Calendar> GetCalendarEventsByProject(int projectId, long userId);
        Calendar GetCalendarEvent(int id);
        Calendar CreateCalendarEvent(Calendar calendar);
        void CreateCalendarEvents(List<Calendar> calendars);
        void UpdateCalendarEvent(Calendar calendar);
        IEnumerable<Calendar> GetCalendarByUser(long userId, int taskId);
        IEnumerable<Calendar> GetCalendarByProjectTask(int taskId);
        void InsertEvent(int projectId, string title, DateTime startDate, string user);
        void DeleteEvents(IEnumerable<Calendar> events);

        IEnumerable<Calendar> GetCalendarReleasesProjects();

    }
}
