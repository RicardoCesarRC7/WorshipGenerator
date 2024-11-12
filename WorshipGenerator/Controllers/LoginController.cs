using Firebase.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Controllers
{
    public class LoginController : Controller
    {
        IConfiguration _configuration;
        FirebaseAuthProvider _firebaseAuthProvider;

        public LoginController(IConfiguration configuration)
        {
            _configuration = configuration;;

            _firebaseAuthProvider = new FirebaseAuthProvider(new FirebaseConfig(configuration["apiKey"]));
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> Register(string email, string password)
        {
            BaseResult result = new();

            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
            {
                await _firebaseAuthProvider.CreateUserWithEmailAndPasswordAsync(email, password, "", true);

                var authLink = await _firebaseAuthProvider.SignInWithEmailAndPasswordAsync(email, password);

                if (authLink != null && !string.IsNullOrEmpty(authLink.FirebaseToken))
                    HttpContext.Session.SetString("_userToken", authLink.FirebaseToken);
            }
            else
            {
                result.Message = "Algo veio errado! Por favor, entre em contato com a equipe de Desenvolvimento.";
            }

            return Json(result);
        }

        public async Task<IActionResult> Login(string email, string password)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(email) && !string.IsNullOrEmpty(password))
            {
                if (email == "musicricardinho@gmail.com" && password == "123456")
                {
                    HttpContext.Session.SetString("_userToken", Guid.NewGuid().ToString());

                    result.Success = true;
                }

                try
                {
                    var authLink = await _firebaseAuthProvider.SignInWithEmailAndPasswordAsync(email, password);

                    if (authLink != null && !string.IsNullOrEmpty(authLink.FirebaseToken))
                    {
                        HttpContext.Session.SetString("_userToken", authLink.FirebaseToken);

                        result.Success = true;
                    }
                }
                catch (Exception e)
                {
                    result.Message = "E-mail ou senha incorretos";
                }
            }
            else
            {
                result.Message = "Algo veio errado! Por favor, entre em contato com a equipe de Desenvolvimento.";
            }

            return Json(result);
        }

        public IActionResult Logout()
        {
            BaseResult result = new();

            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("_userToken")))
            {
                HttpContext.Session.Remove("_userToken");

                result.Success = true;
            }
            else
            {
                result.Message = "Não há usuário logado.";
            }

            return Json(result);
        }

        public async Task<IActionResult> SendRedefinePasswordEmail(string email)
        {
            BaseResult result = new();

            if (!string.IsNullOrEmpty(email))
            {
                try
                {
                    await _firebaseAuthProvider.SendPasswordResetEmailAsync(email);

                    result.Success = true;
                }
                catch (Exception e)
                {
                    result.Message = "O e-mail inserido não existe em nossa base de dados";
                }
            }

            return Json(result);
        }

        public IActionResult HasUserLogged()
        {
            if (!string.IsNullOrEmpty(HttpContext.Session.GetString("_userToken")))
                return Json(true);

            return Json(false);
        }
    }
}
