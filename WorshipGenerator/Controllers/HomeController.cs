using Microsoft.AspNetCore.Mvc;
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
        private readonly IProgramacaoRepository _programacaoRepository;
        private readonly ILogger<HomeController> _logger;

        public HomeController(IProgramacaoRepository programacaoRepository, ILogger<HomeController> logger)
        {
            _programacaoRepository = programacaoRepository;
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            var programacoes = await _programacaoRepository.ListAll();

            return View(programacoes);
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
