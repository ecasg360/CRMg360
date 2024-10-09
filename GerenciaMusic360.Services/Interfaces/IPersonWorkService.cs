using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonWorkService
    {
        PersonWork GetPersonWork(int id);
        PersonWork GetPersonWorkByType(int personId, int typeId);
        void CreatePersonWork(PersonWork personWork);
        void UpdatePersonWork(PersonWork personWork);
        void DeletePersonWork(PersonWork personWork);
    }
}
