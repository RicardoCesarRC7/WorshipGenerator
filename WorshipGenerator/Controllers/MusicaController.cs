using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Enums;
using WorshipGenerator.Models.Repositories.Musica;
using WorshipGenerator.Filters;
using Microsoft.AspNetCore.Http;

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
            var token = HttpContext.Session.GetString("_userToken");

            if (!string.IsNullOrEmpty(token))
            {
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }

        public IActionResult Relacao(string id)
        {
            var token = HttpContext.Session.GetString("_userToken");

            if (!string.IsNullOrEmpty(token))
            {
                ViewBag.setId = id;

                return View();
            }
            else
            {
                return RedirectToAction("Index", "Login");
            }
        }

        public IActionResult DetalhesRelacao(string id)
        {
            ViewBag.setId = id;

            return View();
        }

        public IActionResult Gerenciar()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> AdicionarMusica(Song request)
        {
            return Json(await _musicaRepository.Adicionar(request));
        }

        [HttpPost]
        public async Task<IActionResult> EditarMusica(Song request)
        {
            return Json(await _musicaRepository.Editar(request));
        }

        [HttpPost]
        public async Task<IActionResult> RemoverMusica(string id)
        {
            return Json(await _musicaRepository.Remover(id));
        }

        [HttpPost]
        public IActionResult CarregarItensRelacao(string from, string to)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(from) && !string.IsNullOrEmpty(to))
            {
                try
                {
                    DateTime dataAtual = Convert.ToDateTime(from);
                    DateTime ate = Convert.ToDateTime(to);

                    PeriodicSet relacao = new PeriodicSet
                    { 
                        Type = ESetType.MUSIC,
                        From = dataAtual,
                        To = ate,
                        MusicSet = new List<MusicSet>()
                    };

                    while (dataAtual <= ate)
                    {
                        if (dataAtual.DayOfWeek == DayOfWeek.Sunday)
                        {
                            MusicSet relacaoMusical = new MusicSet
                            { 
                                Date = dataAtual,
                                Songs = new List<Song>() { new Song() }
                            };

                            relacao.MusicSet.Add(relacaoMusical);
                        }

                        dataAtual = dataAtual.AddDays(1);
                    }

                    result.Success = true;
                    result.Content = relacao;
                }
                catch (Exception e)
                {
                    _logger.LogInformation("Erro carregando itens de relacao musical: " + e.Message, e);

                    result.Success = false;
                }
            }

            return Json(result);
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
        public async Task<IActionResult> AdicionarRelacaoMusical(PeriodicSet request)
        {
            return Json(await _musicaRepository.AdicionarRelacao(request));
        }

        [HttpPost]
        public async Task<IActionResult> BuscarRelacao(string request)
        {
            return Json(await _musicaRepository.BuscarRelacao(request));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateMusicSet(PeriodicSet request)
        {
            return Json(await _musicaRepository.UpdateMusicSet(request));
        }

        [HttpGet]
        public async Task<IActionResult> ListarRelacoes()
        {
            return Json(await _musicaRepository.ListarRelacoes());
        }
    }
}
