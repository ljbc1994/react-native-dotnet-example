using Microsoft.AspNetCore.Mvc;

namespace DotnetSpa.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("js-{auto}", new { 
                SiteUrl = Url.Content("~/"),
                User = new { 
                    User = new
                    {
                        Email = "barry"
                    }
                },
            });
        }
    }
}
