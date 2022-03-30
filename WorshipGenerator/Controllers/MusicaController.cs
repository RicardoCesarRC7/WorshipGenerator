using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger<MusicaController> _logger;

        public MusicaController(IMusicaRepository musicaRepository, ILogger<MusicaController> logger)
        {
            _musicaRepository = musicaRepository;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CriarRelacao()
        {
            return View();
        }

        public async Task<IActionResult> DetalhesRelacao(string id)
        {
            var relacaoMusical = await _musicaRepository.BuscarRelacao(id);

            return View(relacaoMusical);
        }

        public async Task<IActionResult> Gerenciar()
        {
            var musicas = await _musicaRepository.Listar();

            return View(musicas);
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarMusica(Musica musica)
        {
            return Json(await _musicaRepository.Adicionar(musica));
        }

        [HttpPost]
        public async Task<IActionResult> EditarMusica(Musica musica)
        {
            return Json(await _musicaRepository.Editar(musica));
        }

        [HttpPost]
        public async Task<IActionResult> RemoverMusica(string id)
        {
            return Json(await _musicaRepository.Remover(id));
        }

        [HttpPost]
        public IActionResult CarregarItensRelacao(string deRequest, string ateRequest)
        {
            List<DateTime> domingos = new List<DateTime>();

            if (!string.IsNullOrEmpty(deRequest) && !string.IsNullOrEmpty(deRequest))
            {
                try
                {
                    DateTime dataAtual = Convert.ToDateTime(deRequest);
                    DateTime ate = Convert.ToDateTime(ateRequest);

                    while (dataAtual <= ate)
                    {
                        if (dataAtual.DayOfWeek == DayOfWeek.Sunday)
                            domingos.Add(dataAtual);

                        dataAtual = dataAtual.AddDays(1);
                    }
                }
                catch (Exception e)
                {
                    _logger.LogInformation("Erro carregando itens de relacao musical: " + e.Message, e);
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

        [HttpGet]
        public async Task<IActionResult> ListarFontesMusicais()
        {
            return Json(await _musicaRepository.ListarFontes());
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarRelacaoMusical(RelacaoPeriodica request)
        {
            return Json(await _musicaRepository.AdicionarRelacao(request));
        }

        [HttpGet]
        public async Task<IActionResult> ListarRelacoes()
        {
            return Json(await _musicaRepository.ListarRelacoes());
        }
    }
}
