using GerenciaMusic360.Services.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;

namespace GerenciaMusic360
{
    public class ActionFilter : IActionFilter
    {
        private readonly IPermissionService _permissionService;
        public ActionFilter(IPermissionService permissionService)
        {
            _permissionService = permissionService;
        }
        public ActionFilter()
        {
        }
        public void OnActionExecuted(ActionExecutedContext context)
        {

        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
#if DEBUG
            var allowedPermissions = Startup.allowedPermissions;
            string actionName = (string)context.RouteData.Values["action"];
            string controllerName = (string)context.RouteData.Values["controller"];
            var actions = context.HttpContext.User.Claims.Where(cl => cl.Type == controllerName)
                .FirstOrDefault();
            if (actions != null)
            {
                var allowActions = actions.Value.Split(",").ToList();
                var setAllowActions = Startup.allowedPermissions.Where(p => p.ControllerName.Replace("Controller", "") == controllerName).Select(item => item.ActionName).ToList();
                if (!allowActions.Contains(actionName) && !setAllowActions.Contains(actionName))
                {
                    context.HttpContext.Response.StatusCode = 500;
                }
            }
            else if (!Startup.allowedPermissions.Where(p => p.ControllerName.Replace("Controller", "").Contains(controllerName)).Any())//("Account" != controllerName)
            {
                context.HttpContext.Response.StatusCode = 500;
            }

#endif
        }

    }
}
