using GerenciaMusic360.Entities;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IPersonAlbumService
    {
        PersonAlbum GetPersonAlbum(int id);
        PersonAlbum GetPersonAlbumByType(int personId, int typeId);
        void CreatePersonAlbum(PersonAlbum personAlbum);
        void UpdatePersonAlbum(PersonAlbum personAlbum);
        void DeletePersonAlbum(PersonAlbum personAlbum);
    }
}
