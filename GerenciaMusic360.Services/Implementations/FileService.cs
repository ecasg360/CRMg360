using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class FileService : Repository<Files>, IFileService
    {
        public FileService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Files> GetAllFiles()
        {
            DbCommand cmd = LoadCmd("GetFiles");
            return ExecuteReader(cmd);
        }

        public Files GetFile(int id) =>
        Find(w => w.Id == id);

        public Files GetFile(int moduleId, int rowId) =>
        Find(w => w.ModuleId == moduleId && w.RowId == rowId);

        public Files GetFileByName(string fileName) =>
        Find(w => w.FileName == fileName);

        public IEnumerable<Files> GetFiles(int moduleId, int rowId) =>
        FindAll(w => w.ModuleId == moduleId && w.RowId == rowId);

        public Files CreateFile(Files file) =>
        Add(file);

        public void UpdateFile(Files file) =>
        Update(file, file.Id);

        public void DeleteFile(Files file) =>
        Delete(file);

        public Files GetFileByModuleAndName(int moduleId, int rowId, string fileName) =>
        FindAll(w => w.ModuleId == moduleId && w.RowId == rowId && w.FileName == fileName).FirstOrDefault();

        public Files GetFileByModuleAndNameActive(int moduleId, int rowId, string fileName) =>
        FindAll(w => w.ModuleId == moduleId && w.RowId == rowId && w.FileName == fileName && w.StatusRecordId == 1).FirstOrDefault();
    }
}
