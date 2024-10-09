using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace GerenciaMusic360.Repository
{
    public interface IRepository<T> where T : class
    {
        IEnumerable<T> GetAll();
        IEnumerable<T> GetAll(params string[] list);
        Task<IEnumerable<T>> GetAllAsync();
        Task<IEnumerable<T>> GetAllAsync(params string[] list);
        T Get(object key);
        Task<T> GetAsync(object key);
        T Find(Expression<Func<T, bool>> match);
        Task<T> FindAsync(Expression<Func<T, bool>> match);
        IEnumerable<T> FindAll(Expression<Func<T, bool>> match);
        IEnumerable<T> FindAll(Expression<Func<T, bool>> match, params string[] list);
        Task<IEnumerable<T>> FindAllAsync(Expression<Func<T, bool>> match);
        T Add(T entity);
        IEnumerable<T> AddRange(IEnumerable<T> entities);
        Task<T> AddAsync(T entity);
        T Update(T entity, object key);
        Task<T> UpdateAsync(T entity, object key);
        void Delete(T entity);
        void DeleteRange(IEnumerable<T> entities);
        Task<int> DeleteAsync(T entity);
        int Count();
        Task<int> CountAsync();
        DbCommand LoadCmd(string name);
        DbCommand AddParameter(DbCommand cmd, string name, object value);
        IEnumerable<T> ExecuteReader(DbCommand cmd);
    }
}
