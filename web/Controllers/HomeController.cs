using Microsoft.AspNetCore.Mvc;

namespace DotnetSpa.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("~/Views/Index.cshtml");
        }
    }
}
