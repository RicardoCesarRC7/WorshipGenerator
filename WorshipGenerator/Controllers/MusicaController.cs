using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Repositories.Musica;

namespace WorshipGenerator.Controllers
{
    public class MusicaController : Controller
    {
        private readonly IMusicaRepository _musicaRepository;

        public MusicaController(IMusicaRepository musicaRepository)
        {
            _musicaRepository = musicaRepository;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CriarRelacao()
        {
            return View("CriarRelacaoMusicas");
        }

        public IActionResult Gerenciamento()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarMusica(Musica musica)
        {
            return Json(await _musicaRepository.Adicionar(musica));
        }

        [HttpPost]
        public IActionResult CarregarItensRelacao(string deRequest, string ateRequest)
        {
            List<DateTime> domingos = new();

            if (!string.IsNullOrEmpty(deRequest) && !string.IsNullOrEmpty(deRequest))
            {
                DateTime dataAtual = Convert.ToDateTime(deRequest);
                DateTime ate = Convert.ToDateTime(ateRequest);

                while (dataAtual <= ate)
                {
                    if (dataAtual.DayOfWeek == DayOfWeek.Sunday)
                        domingos.Add(dataAtual);

                    dataAtual = dataAtual.AddDays(1);
                }

                return PartialView("_AdicionarItensRelacaoMusicas", domingos);
            }

            return null;
        }

        [HttpGet]
        public async Task<IActionResult> ListarMusicas()
        {
            return Json(await _musicaRepository.Listar());
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarRelacaoMusical(RelacaoPeriodica request)
        {
            return Json(await _musicaRepository.AdicionarRelacao(request));
        }
    }
}
