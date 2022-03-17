using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models.Repositories.Programacao
{
    public class ProgramacaoRepository : IProgramacaoRepository
    {
        private readonly string _firebaseUrl;
        private readonly FirebaseClient _firebaseClient;
        private readonly IConfiguration _configuration;

        public ProgramacaoRepository(IConfiguration configuration)
        {
            _configuration = configuration;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);
            }
        }

        public async Task<Models.Programacao> Get(string id)
        {
            Models.Programacao result = null;

            if (!string.IsNullOrEmpty(id))
            {
                result = await _firebaseClient
                    .Child("Programacoes")
                    .Child(id)
                    .OnceSingleAsync<Models.Programacao>();
            }

            return result;
        }

        public async Task<List<Models.Programacao>> ListAll()
        {
            List<Models.Programacao> result = null;

            try
            {
                var programacoes = await _firebaseClient
                .Child("Programacoes")
                .OnceAsync<Models.Programacao>();

                if (programacoes != null && programacoes.Count > 0)
                {
                    result = new List<Models.Programacao>();

                    foreach (var item in programacoes)
                    {
                        Models.Programacao programa = item.Object;

                        programa.Id = item.Key;

                        result.Add(programa);
                    }

                    result = result.OrderByDescending(i => i.Data).Take(5).ToList();
                }
            }
            catch (Exception e)
            {
                result = new List<Models.Programacao>();
            }

            return result;
        }
    }
}
