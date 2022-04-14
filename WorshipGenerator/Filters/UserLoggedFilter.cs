using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Filters
{
    public class UserLoggedFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (context.HttpContext.Session == null || string.IsNullOrEmpty(context.HttpContext.Session.GetString("_userToken")))
                context.Result = new JsonResult(new BaseResult { Success = false });

            base.OnActionExecuting(context);
        }
    }
}
