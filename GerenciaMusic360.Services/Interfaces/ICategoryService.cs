using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface ICategoryService
    {
        IEnumerable<Category> GetAllCategories();
        IEnumerable<Category> GetAllCategoriesWithModule();
        IEnumerable<Category> GetCategoriesByModule(int moduleId, int projectTypeId);
        Category GetFather(int projectBudgetDetailId);
        Category GetCategory(int id);
        Category CreateCategory(Category category);
        void UpdateCategory(Category category);
        void DeleteCategory(Category category);
    }
}
