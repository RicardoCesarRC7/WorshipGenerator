using Firebase.Database;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models;
using Firebase.Database.Query;
using WorshipGenerator.Models.Enums;

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
                if (!string.IsNullOrEmpty(musica.Fonte.Id))
                    musica.Fonte = await BuscarFonte(musica.Fonte.Id);

                await _firebaseClient.Child("Musicas").PostAsync(JsonConvert.SerializeObject(musica));

                result.Success = true;
            }

            return result;
        }

        public async Task<BaseResult> Editar(Models.Musica musica)
        {
            BaseResult result = new BaseResult();

            if (musica != null)
            {
                if (!string.IsNullOrEmpty(musica.Fonte.Id))
                    musica.Fonte = await BuscarFonte(musica.Fonte.Id);

                await _firebaseClient.Child("Musicas").Child(musica.Id).PutAsync(JsonConvert.SerializeObject(musica));

                result.Success = true;
            }

            return result;
        }

        public async Task<Models.Musica> Buscar(string id)
        {
            Models.Musica musica = null;

            if (!string.IsNullOrEmpty(id))
            {
                musica = await _firebaseClient.Child("Musicas").Child(id).OnceSingleAsync<Models.Musica>();

                musica.Id = id;
            }

            return musica;
        }

        public async Task<BaseResult> Remover(string id)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(id))
            {
                try
                {
                    await _firebaseClient.Child("Musicas").Child(id).DeleteAsync();

                    result.Success = true;
                }
                catch (Exception e)
                {
                    result.Message = "Ocorreu um erro durante a operação: " + e.Message;
                }
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

        public async Task<List<FonteMusical>> ListarFontes()
        {
            List<FonteMusical> fontes = new List<FonteMusical>();

            try
            {
                var result = await _firebaseClient.Child("FontesMusicais").OnceAsync<FonteMusical>();

                if (result != null && result.Count > 0)
                {
                    foreach (var item in result)
                    {
                        FonteMusical fonte = item.Object;

                        fonte.Id = item.Key;

                        fontes.Add(fonte);
                    }
                }
            }
            catch (Exception e)
            {

            }

            return fontes;
        }

        public async Task<FonteMusical> BuscarFonte(string id)
        {
            FonteMusical fonte = null;

            if (!string.IsNullOrEmpty(id))
            {
                fonte = await _firebaseClient.Child("FontesMusicais").Child(id).OnceSingleAsync<FonteMusical>();

                fonte.Id = id;
            }

            return fonte;
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

        public async Task<RelacaoPeriodica> BuscarRelacao(string id)
        {
            RelacaoPeriodica relacao = null;

            if (!string.IsNullOrEmpty(id))
            {
                relacao = await _firebaseClient.Child("RelacoesMusicais").Child(id).OnceSingleAsync<RelacaoPeriodica>();

                if (relacao != null && relacao.RelacoesMusicais != null && relacao.RelacoesMusicais.Count > 0)
                {
                    foreach (var relacaoMusical in relacao.RelacoesMusicais)
                    {
                        if (relacaoMusical.Musicas != null && relacaoMusical.Musicas.Count > 0)
                        {
                            foreach (var musica in relacaoMusical.Musicas)
                            {
                                var result = await Buscar(musica.Id);

                                musica.Nome = result.Nome;
                                musica.Autor = result.Autor;
                                musica.Pagina = result.Pagina;
                                musica.Edicao = result.Edicao;
                            }
                        }
                    }
                }
            }

            return relacao;
        }

        public async Task<List<RelacaoPeriodica>> ListarRelacoes()
        {
            var result = new List<RelacaoPeriodica>();

            try
            {
                var relacoes = await _firebaseClient.Child("RelacoesMusicais").OnceAsync<RelacaoPeriodica>();

                if (relacoes != null && relacoes.Count > 0)
                {
                    foreach (var relacao in relacoes)
                    {
                        RelacaoPeriodica relacaoPeriodica = relacao.Object;

                        relacaoPeriodica.Tipo = ERelacaoTipo.MUSICAL;
                        relacaoPeriodica.Id = relacao.Key;

                        result.Add(relacaoPeriodica);
                    }
                }
            }
            catch (Exception e)
            {
            }

            return result;
        }

        public async Task<bool> InserirFontesMusicais()
        {
            var fontes = new List<FonteMusical>
            {
                new FonteMusical { Nome = "Cifras IBET 1º Edição" },
                new FonteMusical { Nome = "Cantor Cristão" },
                new FonteMusical { Nome = "Voz de Melodia" }
            };

            foreach (var item in fontes)
                await _firebaseClient.Child("FontesMusicais").PostAsync(item);

            return true;
        }
    }
}
