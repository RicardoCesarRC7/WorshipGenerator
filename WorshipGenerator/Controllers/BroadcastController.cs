using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Enums;

namespace WorshipGenerator.Controllers
{
    public class BroadcastController : Controller
    {


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Set()
        {
            return View();
        }

        [HttpPost]
        public IActionResult LoadSetItems(string from, string to)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(from) && !string.IsNullOrEmpty(to))
            {
                try
                {
                    PeriodicSet periodicSet = new PeriodicSet(ESetType.BROADCAST, from, to);

                    periodicSet.GenerateDates();

                    result.Success = true;
                    result.Content = periodicSet;
                }
                catch (Exception e)
                {
                    result.Success = false;
                }
            }

            return Json(result);
        }
    }
}
