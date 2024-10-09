using GerenciaMusic360.Common.Enum;
using GerenciaMusic360.Entities;
using GerenciaMusic360.Entities.Models;
using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace GerenciaMusic360.Controllers
{
    [ApiController]
    public class MenuController : ControllerBase
    {
        private readonly IMenuService _service;
        public MenuController(IMenuService service)
        {
            _service = service;
        }

        [Route("api/MenusBuild")]
        [HttpGet]
        public MethodResponse<List<MenuModel>> GetMenuBuild()
        {
            var result = new MethodResponse<List<MenuModel>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var menus = _service.GetList().Where(menu => menu.StatusRecordId == 1).ToList();
                result.Result = BuildMenu(menus.OrderBy(item => item.MenuOrder));
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Menus")]
        [HttpGet]
        public MethodResponse<List<Menu>> Get()
        {
            var result = new MethodResponse<List<Menu>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var menus = _service.GetList();
                result.Result = menus.ToList();
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/MenusByType")]
        [HttpGet]
        public MethodResponse<List<Menu>> GetByType(MenuType type)
        {
            var result = new MethodResponse<List<Menu>> { Code = 100, Message = "Success", Result = null };
            try
            {
                var menus = _service.GetList().Where(x => x.Type == type.ToString()).ToList();
                result.Result = menus;
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        private List<MenuModel> BuildMenu(IEnumerable<Menu> menus)
        {
            menus = menus.Where(item => item.MenuOrder != null).ToList();
            List<MenuModel> lstmenu = new List<MenuModel>();
            List<string> lstIdsChild = new List<string>();
            menus.ToList().ForEach(item =>
            {

                GetChilds(item, menus, lstmenu, lstIdsChild);


            });
            return lstmenu.Where(item => item.Id != null).ToList();
        }

        private void GetChilds(Menu item, IEnumerable<Menu> menus, List<MenuModel> lstmenu, List<string> lstIdsChild)
        {
            if (lstIdsChild.Contains(item.Id))
            {
                return;
            }
            MenuModel menu = new MenuModel();
            menu.Id = item.Id;
            menu.Title = item.Title;
            menu.Translate = item.Translate;
            menu.Type = item.Type;
            menu.Icon = item.Icon;
            menu.Url = item.Url;
            menu.children = new List<MenuModel>();
            menu.Roles = item.Roles;
            var childsMenu = new List<Menu>();
            childsMenu = menus.Where(child => item.Id == child.ParentId).ToList();
            lstIdsChild.Add(menu.Id);
            if (childsMenu.Count() > 0)
            {
                lstmenu.Add(menu);
                foreach (var childMenu in childsMenu)
                {
                    MenuModel child = new MenuModel();
                    menu.children.Add(child);
                    child.Id = childMenu.Id;
                    child.Title = childMenu.Title;
                    child.Translate = childMenu.Translate;
                    child.Type = childMenu.Type;
                    child.Icon = childMenu.Icon;
                    child.Url = childMenu.Url;
                    child.Roles = childMenu.Roles;
                    lstIdsChild.Add(child.Id);
                    GetChilds(childMenu, childsMenu, menu.children, lstIdsChild);
                }
            }
            else
            {
                lstmenu.FirstOrDefault().children.ForEach(parentmenu =>
                {
                    if (parentmenu.Id == item.ParentId)
                    {
                        GetChilds(item, childsMenu, lstmenu.FirstOrDefault().children, lstIdsChild);
                        parentmenu.children.Add(menu);
                    }
                    else
                    {
                        GetChilds(item, childsMenu, lstmenu.FirstOrDefault().children, lstIdsChild);
                    }
                });
            }

        }

        [Route("api/Menu")]
        [HttpGet]
        public MethodResponse<Menu> Get(string id)
        {
            var result = new MethodResponse<Menu> { Code = 100, Message = "Success", Result = null };
            try
            {
                result.Result = _service.Get(id);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = null;
            }
            return result;
        }

        [Route("api/Menu")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody] Menu model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                model.StatusRecordId = 1;
                model.Created = DateTime.Now;
                model.Creator = userId;
                _service.Create(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Menu")]
        [HttpPut]
        public MethodResponse<bool> Put([FromBody] Menu model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var menu = _service.Get(model.Id);
                model.Modifier = userId;
                model.Modified = DateTime.Now;
                model.Creator = menu.Creator;
                model.Created = menu.Created;
                _service.Update(model);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/MenuStatus")]
        [HttpPost]
        public MethodResponse<bool> Post([FromBody]StatusUpdateModel model)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = true };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var menu = _service.Get(model.Id.ToString());
                menu.Modified = DateTime.Now;
                menu.Modifier = userId;
                menu.StatusRecordId = model.Status;
                _service.Update(menu);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }

        [Route("api/Menu")]
        [HttpDelete]
        public MethodResponse<bool> Delete(string id)
        {
            var result = new MethodResponse<bool> { Code = 100, Message = "Success", Result = false };
            try
            {
                var userId = User.Identities.First().Claims.First(w => w.Type == "id").Value;
                var menu = _service.Get(id);
                menu.Erased = DateTime.Now;
                menu.Eraser = userId;
                _service.Update(menu);
            }
            catch (Exception ex)
            {
                result.Message = ex.Message;
                result.Code = -100;
                result.Result = false;
            }
            return result;
        }
    }
}