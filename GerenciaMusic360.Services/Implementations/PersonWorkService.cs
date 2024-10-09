using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class PersonWorkService : Repository<PersonWork>, IPersonWorkService
    {
        public PersonWorkService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public void CreatePersonWork(PersonWork personWork) =>
        Add(personWork);

        public PersonWork GetPersonWork(int id)
        {
            DbCommand cmd = LoadCmd("GetPersonWork");
            cmd = AddParameter(cmd, "Id", id);
            return ExecuteReader(cmd).First();
        }

        public PersonWork GetPersonWorkByType(int personId, int typeId)
        {
            DbCommand cmd = LoadCmd("GetPersonWorkByType");
            cmd = AddParameter(cmd, "PersonId", personId);
            cmd = AddParameter(cmd, "Id", typeId);
            return ExecuteReader(cmd).First();
        }

        public void UpdatePersonWork(PersonWork personWork) =>
        Update(personWork, personWork.Id);

        public void DeletePersonWork(PersonWork personWork) =>
        Delete(personWork);
    }
}
