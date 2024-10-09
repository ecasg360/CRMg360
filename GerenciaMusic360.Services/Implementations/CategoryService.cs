using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class CategoryService : Repository<Category>, ICategoryService
    {
        public CategoryService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Category> GetAllCategories() =>
        FindAll(w => w.StatusRecordId != 3);

        public IEnumerable<Category> GetAllCategoriesWithModule()
        {
            return _context.Category.Include(r => r.Module).Where(x => x.StatusRecordId != 3).ToList();
        }

        public IEnumerable<Category> GetCategoriesByModule(int moduleId, int projectTypeId)
        {
            DbCommand cmd = LoadCmd("GetCategoryByModule");
            cmd = AddParameter(cmd, "ModuleId", moduleId);
            cmd = AddParameter(cmd, "ProjectTypeId", projectTypeId);
            return ExecuteReader(cmd);
        }

        public Category GetFather(int projectBudgetDetailId)
        {
            DbCommand cmd = LoadCmd("GetCategoryFather");
            cmd = AddParameter(cmd, "ProjectBudgetDetailId", projectBudgetDetailId);
            return ExecuteReader(cmd).First();
        }

        public Category GetCategory(int id) =>
        Find(w => w.Id == id);

        public Category CreateCategory(Category category) =>
        Add(category);

        public void UpdateCategory(Category category) =>
        Update(category, category.Id);

        public void DeleteCategory(Category category) =>
        Delete(category);

    }
}
