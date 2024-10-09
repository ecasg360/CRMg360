using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class TodoModel
    {
        public List<TodoModel> children = new List<TodoModel>();
        public string Item { get; set; }
        public bool Checked { get; set; }
        public string Id { get; set; }
        public bool indeterminate { get; set; }
    }
}
