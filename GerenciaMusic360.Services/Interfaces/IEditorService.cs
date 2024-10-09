using GerenciaMusic360.Entities;
using System.Collections.Generic;

namespace GerenciaMusic360.Services.Interfaces
{
    public interface IEditorService
    {
        IEnumerable<Editor> GetAllEditors();
        IEnumerable<Editor> GetAllEditorsByIsInternal(bool IsInternal);
        Editor GetEditor(int id);
        Editor CreateEditor(Editor editor);
        void UpdateEditor(Editor editor);
    }
}
