using Firebase.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Repositories.Programacao;

namespace WorshipGenerator.Controllers
{
    public class HomeController : Controller
    {
        private readonly string _apiKey;

        private readonly IProgramacaoRepository _programacaoRepository;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IProgramacaoRepository programacaoRepository, ILogger<HomeController> logger, IConfiguration configuration)
        {
            _programacaoRepository = programacaoRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var token = HttpContext.Session.GetString("_UserToken");

            if (!string.IsNullOrEmpty(token))
            {
                var programacoes = await _programacaoRepository.ListAll();

                return View(programacoes);
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }

        public IActionResult ListAllProgramacoes()
        {
            return Json(_programacaoRepository.ListAll());
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
