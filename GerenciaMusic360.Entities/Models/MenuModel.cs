using System.Collections.Generic;

namespace GerenciaMusic360.Entities.Models
{
    public class MenuModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Translate { get; set; }
        public string Type { get; set; }
        public string Icon { get; set; }
        public string Url { get; set; }
        public List<MenuModel> children = new List<MenuModel>();

        public string Roles { get; set; }
    }
}
