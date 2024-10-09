using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IComposerDetailService
    {
        IEnumerable<ComposerDetail> GetAllComposerDetail();
        ComposerDetail GetComposerDetail(int id);
        ComposerDetail GetComposerDetailsByComposerId(int composerId);
        ComposerDetail CreateComposerDetail(ComposerDetail composerDetail);
        void UpdateComposerDetail(ComposerDetail composerDetail);
        void DeleteComposerDetail(ComposerDetail composerDetail);
    }
}
