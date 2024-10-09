using GerenciaMusic360.Data;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Repository;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Services.Implementations
{
    public class EditorService : Repository<Editor>, IEditorService
    {
        public EditorService(Context_DB repositoryContext)
        : base(repositoryContext)
        {
        }

        public IEnumerable<Editor> GetAllEditors() =>
        FindAll(w => w.StatusRecordId == 1);

        public IEnumerable<Editor> GetAllEditorsByIsInternal(bool IsInternal)
        {
            return _context.Editor.Include(r => r.Association).Where(x => x.StatusRecordId == 1 && x.IsInternal == IsInternal);
        }

        public Editor GetEditor(int id) =>
        Find(w => w.Id == id);

        public Editor CreateEditor(Editor editor) =>
        Add(editor);

        public void UpdateEditor(Editor editor) =>
        Update(editor, editor.Id);
    }
}
