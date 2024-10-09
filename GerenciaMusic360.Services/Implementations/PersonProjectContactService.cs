using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonProjectContactService : Repository<PersonProjectContact>, IPersonProjectContactService
    {
        public PersonProjectContactService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<PersonProjectContact> GetAllPersonsProjectContacts()
        {
            DbCommand cmd = LoadCmd("GetAllPersonsProjectContacts");
            IEnumerable<PersonProjectContact> projectContacts = ExecuteReader(cmd);

            return projectContacts;
        }

        public IEnumerable<PersonProjectContact> GetProjectContactsByProject(int projectId)
        {
            DbCommand cmd = LoadCmd("GetProjectContactsByProject");
            cmd = AddParameter(cmd, "ProjectId", projectId);
            IEnumerable<PersonProjectContact> projectContacts = ExecuteReader(cmd);

            return ProcessProjectContacts(projectContacts);
        }

        public IEnumerable<Person> GetByLabel()
        {
            DbCommand cmd = LoadCmd("GetProjectContactsByLabel");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Person> GetByAgency()
        {
            DbCommand cmd = LoadCmd("GetProjectContactsByAgency");
            return ExecuteReader(cmd);
        }

        public IEnumerable<Person> GetByEvent()
        {
            DbCommand cmd = LoadCmd("GetProjectContactsByEvent");
            return ExecuteReader(cmd);
        }

        public IEnumerable<PersonProjectContact> GetPersonsContactsByType(int personTypeId)
        {
            DbCommand cmd = LoadCmd("GetPersonsContactsByType");
            cmd = AddParameter(cmd, "PersonTypeId", personTypeId);
            IEnumerable<PersonProjectContact> projectContacts = ExecuteReader(cmd);

            return ProcessProjectContacts(projectContacts);
        }



        public IEnumerable<Person> GetAllPersonsContacts()
        {
            DbCommand cmd = LoadCmd("GetAllPersonsProjectContacts");
            IEnumerable<Person> personContacts = ExecuteReader(cmd);

            return personContacts;
        }

        private IEnumerable<PersonProjectContact> ProcessProjectContacts(
            IEnumerable<PersonProjectContact> projectContacts)
        {
            List<PersonProjectContact> result = new List<PersonProjectContact>();
            IEnumerable<int> ids = projectContacts.Select(s => s.Id)
                                  .Distinct();

            foreach (int id in ids)
            {
                PersonProjectContact projectContact = projectContacts.First(w => w.Id == id);
                projectContact.TypeId = 0;
                projectContact.ProjectId = 0;
                projectContact.ProjectTypeId = 0;

                projectContact.ProjectContacts = projectContacts.Where(w => w.Id == id)
                    .Select(s => new ProjectContact
                    {
                        Id = s.ProjectTypeId,
                        ProjectId = s.ProjectId,
                        PersonId = s.Id,
                        TypeId = s.TypeId
                    })
                    .ToList();

                result.Add(projectContact);
            }

            return result;
        }
    }
}
