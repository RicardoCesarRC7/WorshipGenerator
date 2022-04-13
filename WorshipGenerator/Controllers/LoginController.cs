using Firebase.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
            await _firebaseAuthProvider.CreateUserWithEmailAndPasswordAsync(email, password, "", true);

            var authLink = await _firebaseAuthProvider.SignInWithEmailAndPasswordAsync(email, password);

            if (authLink != null && !string.IsNullOrEmpty(authLink.FirebaseToken))
                HttpContext.Session.SetString("_userToken", authLink.FirebaseToken);

            return RedirectToAction("Index", "Home");
        }

        public async Task<IActionResult> Login(string email, string password)
        {
            try
            {
                var authLink = await _firebaseAuthProvider.SignInWithEmailAndPasswordAsync(email, password);

                if (authLink != null && !string.IsNullOrEmpty(authLink.FirebaseToken))
                    HttpContext.Session.SetString("_userToken", authLink.FirebaseToken);

                return RedirectToAction("Index", "Home");
            }
            catch (Exception e)
            {

            }

            return View("Index");
        }

        public IActionResult Logout()
        {
            HttpContext.Session.Remove("_userToken");

            return RedirectToAction("Index", "Home");
        }
    }
}
