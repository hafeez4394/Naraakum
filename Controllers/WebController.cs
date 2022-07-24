using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Naraakum.Manager;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Naraakum.Controllers
{
    public class WebController : Controller
    {
        public IServiceProvider _serviceProvider;
        public WebController(IServiceProvider serviceProvider) {
            _serviceProvider = serviceProvider;
            var service = (CacheManager)_serviceProvider.GetService(typeof(CacheManager));
            service.GetWebAPIAuthToken();
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
