using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class ComposerDetailService : Repository<ComposerDetail>, IComposerDetailService
    {
        public ComposerDetailService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public ComposerDetail CreateComposerDetail(ComposerDetail composerDetail) =>
            Add(composerDetail);

        public void DeleteComposerDetail(ComposerDetail composerDetail) =>
            Delete(composerDetail);


        public IEnumerable<ComposerDetail> GetAllComposerDetail()
        {
            return _context.ComposerDetail.ToList();
        }

        public ComposerDetail GetComposerDetail(int id)
        {
            return Find(x => x.Id == id);
        }

        public ComposerDetail GetComposerDetailsByComposerId(int composerId)
        {
            return _context.ComposerDetail.Include(r => r.Association).Include(r => r.Editor).SingleOrDefault(x => x.ComposerId == composerId);
        }

        public void UpdateComposerDetail(ComposerDetail composerDetail) =>
            Update(composerDetail, composerDetail.Id);
    }
}
