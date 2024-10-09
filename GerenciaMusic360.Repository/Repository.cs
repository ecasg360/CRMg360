using GerenciaMusic360.Common;
using GerenciaMusic360.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace GerenciaMusic360.Repository
{
    public abstract class Repository<T> : IRepository<T> where T : class
    {
        protected Context_DB _context;

        public Repository(Context_DB context)
        {
            _context = context;
        }

        public IEnumerable<T> GetAll()
        {
            return _context.Set<T>().ToList();
        }

        public IEnumerable<T> GetAll(params string[] list)
        {
            IEnumerable<T> listResult = null;
            switch (list.Length)
            {
                case 1:
                    listResult = _context.Set<T>().Include(list[0]).ToList();
                    break;
                case 2:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .ToList();
                    break;
                case 3:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .Include(list[2])
                        .ToList();
                    break;
                case 4:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .Include(list[2])
                        .Include(list[3])
                        .ToList();
                    break;

            }
            return listResult;
        }

        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public async Task<IEnumerable<T>> GetAllAsync(params string[] list)
        {
            IEnumerable<T> listResult = null;
            switch (list.Length)
            {
                case 1:
                    listResult = await _context.Set<T>().Include(list[0]).ToListAsync();
                    break;
                case 2:
                    listResult = await _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .ToListAsync();
                    break;

            }
            return listResult;
        }


        public T Get(object key)
        {
            return _context.Set<T>().Find(key);
        }

        public async Task<T> GetAsync(object key)
        {
            return await _context.Set<T>().FindAsync(key);
        }

        public T Find(Expression<Func<T, bool>> match)
        {
            return _context.Set<T>().SingleOrDefault(match);
        }

        public async Task<T> FindAsync(Expression<Func<T, bool>> match)
        {
            return await _context.Set<T>().SingleOrDefaultAsync(match);
        }

        public IEnumerable<T> FindAll(Expression<Func<T, bool>> match)
        {
            return _context.Set<T>().Where(match).ToList();
        }

        public async Task<IEnumerable<T>> FindAllAsync(Expression<Func<T, bool>> match)
        {
            return await _context.Set<T>().Where(match).ToListAsync();
        }

        public T Add(T entity)
        {
            _context.Set<T>().Add(entity);
            _context.SaveChanges();
            return entity;
        }
        public IEnumerable<T> AddRange(IEnumerable<T> entities)
        {
            _context.Set<T>().AddRange(entities);
            _context.SaveChanges();
            return entities;
        }
        public async Task<T> AddAsync(T entity)
        {
            _context.Set<T>().Add(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public T Update(T entity, object key)
        {
            if (entity == null)
                return null;

            T existing = _context.Set<T>().Find(key);
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(entity);
                _context.SaveChanges();
            }
            return existing;
        }

        public async Task<T> UpdateAsync(T entity, object key)
        {
            if (entity == null)
                return null;

            T existing = await _context.Set<T>().FindAsync(key);
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(entity);
                await _context.SaveChangesAsync();
            }
            return existing;
        }

        public void Delete(T entity)
        {
            _context.Set<T>().Remove(entity);
            _context.SaveChanges();
        }

        public void DeleteRange(IEnumerable<T> entities)
        {
            _context.Set<T>().RemoveRange(entities);
            _context.SaveChanges();
        }

        public async Task<int> DeleteAsync(T entity)
        {
            _context.Set<T>().Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public int Count()
        {
            return _context.Set<T>().Count();
        }

        public async Task<int> CountAsync()
        {
            return await _context.Set<T>().CountAsync();
        }

        public DbCommand LoadCmd(string name)
        {
            var cmd = _context.Database.GetDbConnection().CreateCommand();
            cmd.CommandText = name;
            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            return cmd;
        }

        public DbCommand AddParameter(DbCommand cmd, string name, object value)
        {
            if (string.IsNullOrEmpty(cmd.CommandText))
                throw new InvalidOperationException("Call LoadStoredProc before using this method");

            var param = cmd.CreateParameter();
            param.ParameterName = name;
            param.Value = value;
            cmd.Parameters.Add(param);
            return cmd;
        }

        public IEnumerable<T> ExecuteReader(DbCommand cmd)
        {
            using (cmd)
            {
                if (cmd.Connection.State == System.Data.ConnectionState.Closed)
                    cmd.Connection.Open();
                try
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        return reader.MapToList<T>();
                    }

                }
                catch (Exception e)
                {
                    //throw (e);
                    return null;
                }
                finally
                {
                    cmd.Connection.Close();
                }
            }
        }

        public DbDataReader ExecuteDataReader(DbCommand cmd)
        {
            using (cmd)
            {
                if (cmd.Connection.State == System.Data.ConnectionState.Closed)
                    cmd.Connection.Open();
                try
                {
                    return cmd.ExecuteReader();
                }
                catch (Exception e)
                {
                    //throw (e);
                    return null;
                }
                finally
                {
                    cmd.Connection.Close();
                }
            }
        }

        public DataSet ExecuteDataSet(string connection, string storeProcedure, List<SqlParameter> parameters)
        {
            DataSet ds = new DataSet("DataSet");
            using (SqlConnection conn = new SqlConnection(connection))
            {
                SqlCommand sqlCommand = new SqlCommand(storeProcedure);
                foreach (SqlParameter parameter in parameters)
                {
                    sqlCommand.Parameters.Add(parameter);
                }
                sqlCommand.CommandType = CommandType.StoredProcedure;
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = sqlCommand;

                da.Fill(ds);
            }

            if (ds.Tables.Count > 0)
            {
                return ds;
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<T> FindAll(Expression<Func<T, bool>> match, params string[] list)
        {
            IQueryable<T> listResult = _context.Set<T>();
            switch (list.Length)
            {
                case 1:
                    listResult = _context.Set<T>().Include(list[0]);
                    break;
                case 2:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1]);
                    break;
                case 3:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .Include(list[2]);
                    break;
                case 4:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .Include(list[2])
                        .Include(list[3]);
                    break;
                case 5:
                    listResult = _context.Set<T>()
                        .Include(list[0])
                        .Include(list[1])
                        .Include(list[2])
                        .Include(list[3])
                        .Include(list[4]);
                    break;
            }
            return listResult.Where(match).AsEnumerable();
        }
    }
}
