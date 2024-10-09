using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonProjectContactService
    {
        IEnumerable<PersonProjectContact> GetAllPersonsProjectContacts();
        IEnumerable<Person> GetAllPersonsContacts();
        IEnumerable<PersonProjectContact> GetProjectContactsByProject(int projectId);
        IEnumerable<Person> GetByLabel();
        IEnumerable<Person> GetByAgency();
        IEnumerable<Person> GetByEvent();
        IEnumerable<PersonProjectContact> GetPersonsContactsByType(int personTypeId);
    }
}
