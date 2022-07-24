using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Naraakum.Controllers
{
    public class ServiceController : Controller
    {
        public IActionResult ShowServices()
        {
            return View();
        }
        public IActionResult ShowHospitals()
        {
            return View();
        }
        public IActionResult ShowServiceProviders()
        {
            return View();
        }
        public IActionResult ShowServicesAndPackages() 
        {
            return View();
        }
        public IActionResult ShowSpecialities()
        {
            return View();
        }
        public IActionResult ShowPatientProfile()
        {
            return View();
        }
    }
}
