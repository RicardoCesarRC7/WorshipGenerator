using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SelectPdf;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;

namespace WorshipGenerator.Controllers
{
    public class ProgramacaoController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Detalhes(string id)
        {
            if (!string.IsNullOrEmpty(id))
            {
                var client = new FirebaseClient("https://worship-generator-default-rtdb.firebaseio.com/");

                var programacao = await client
                    .Child("Programacoes")
                    .Child(id)
                    .OnceSingleAsync<Programacao>();

                if (programacao != null)
                    return View(programacao);
            }

            return View("Error");
        }

        public async Task<IActionResult> SalvarProgramacao(Programacao programacao)
        {
            var client = new FirebaseClient("https://worship-generator-default-rtdb.firebaseio.com/");

            var result = await client.Child("Programacoes").PostAsync(JsonConvert.SerializeObject(programacao));

            return Json(result);
        }

        [HttpPost]
        public IActionResult GerarProgramacao(Programacao programacao)
        {
            return View("_TabelaProgramacao", programacao);
        }

        public IActionResult GerarPDF(string id, string url)
        {
            var converter = new HtmlToPdf();

            PdfDocument document = converter.ConvertUrl(url);

            byte[] pdf = document.Save();

            document.Close();

            FileResult fileResult = new FileContentResult(pdf, "application/pdf");

            fileResult.FileDownloadName = $"Programacao-{id}.pdf";

            return fileResult;
        }
    }
}
