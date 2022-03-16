using Firebase.Database;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models;

namespace WorshipGenerator.Models.Repositories.Musica
{
    public class MusicaRepository : IMusicaRepository
    {
        private readonly string _firebaseUrl;
        private readonly FirebaseClient _firebaseClient;
        private readonly IConfiguration _configuration;

        public MusicaRepository(IConfiguration configuration)
        {
            _configuration = configuration;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);
            }
        }

        public async Task<BaseResult> Adicionar(Models.Musica musica)
        {
            BaseResult result = new BaseResult();

            if (musica != null)
            {
                await _firebaseClient.Child("Musicas").PostAsync(JsonConvert.SerializeObject(musica));

                result.Success = true;
            }

            return result;
        }

        public async Task<List<Models.Musica>> Listar()
        {
            List<Models.Musica> musicas = new List<Models.Musica>();

            var result = await _firebaseClient.Child("Musicas").OnceAsync<Models.Musica>();

            if (result != null && result.Count > 0)
            {
                foreach (var item in result)
                {
                    Models.Musica musica = item.Object;

                    musica.Id = item.Key;

                    musicas.Add(musica);
                }
            }

            return musicas;
        }

        public async Task<BaseResult> AdicionarRelacao(RelacaoPeriodica request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    await _firebaseClient.Child("RelacoesMusicais").PostAsync(JsonConvert.SerializeObject(request));

                    result.Success = true;
                }
                catch (Exception e)
                {
                    
                }
            }

            return result;
        }
    }
}
