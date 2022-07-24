using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Naraakum.Controllers
{
    public class HospitalController : Controller
    {
        public IActionResult ManageServices()
        {
            ViewBag.OrganizationId = HttpContext.Session.GetString("OrganizationId");
            ViewBag.OrganizationName = HttpContext.Session.GetString("OrganizationName");

            return View();
        }
        public IActionResult ManageCategory()
        {
            ViewBag.OrganizationId = HttpContext.Session.GetString("OrganizationId");
            ViewBag.OrganizationName = HttpContext.Session.GetString("OrganizationName");
            return View();
        }
        public IActionResult ManageServiceProvider()
        {
            ViewBag.OrganizationId = HttpContext.Session.GetString("OrganizationId");
            ViewBag.OrganizationName = HttpContext.Session.GetString("OrganizationName");
            return View();
        }
    }
}
