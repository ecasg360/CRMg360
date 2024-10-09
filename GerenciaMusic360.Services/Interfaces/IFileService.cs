using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IFileService
    {
        IEnumerable<Files> GetAllFiles();
        Files GetFile(int id);
        Files GetFile(int moduleId, int rowId);
        Files GetFileByName(string fileName);
        IEnumerable<Files> GetFiles(int moduleId, int rowId);
        Files CreateFile(Files file);
        void UpdateFile(Files file);
        void DeleteFile(Files file);
        Files GetFileByModuleAndName(int moduleId, int rowId, string fileName);
        Files GetFileByModuleAndNameActive(int moduleId, int rowId, string fileName);
    }
}
