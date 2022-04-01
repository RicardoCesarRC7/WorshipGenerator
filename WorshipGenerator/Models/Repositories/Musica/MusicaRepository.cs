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

        private readonly string _songsIndexDatabase;
        private readonly string _sourcesIndexDatabase;
        private readonly string _musicSetsIndexDatabase;

        public MusicaRepository(IConfiguration configuration)
        {
            _configuration = configuration;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);

                _songsIndexDatabase = configuration["songsIndexDatabase"];
                _sourcesIndexDatabase = configuration["sourcesIndexDatabase"];
                _musicSetsIndexDatabase = configuration["musicSetsIndexDatabase"];
            }
        }

        public async Task<BaseResult> Adicionar(Song musica)
        {
            BaseResult result = new BaseResult();

            if (musica != null && !string.IsNullOrEmpty(musica.Name))
            {
                if (musica.Source != null && !string.IsNullOrEmpty(musica.Source.Id))
                    musica.Source = await BuscarFonte(musica.Source.Id);

                await _firebaseClient.Child(_songsIndexDatabase).PostAsync(JsonConvert.SerializeObject(musica));

                result.Success = true;
            }

            return result;
        }

        public async Task<BaseResult> Editar(Song request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                if (!string.IsNullOrEmpty(request.Source.Id))
                    request.Source = await BuscarFonte(request.Source.Id);

                await _firebaseClient.Child(_songsIndexDatabase).Child(request.Id).PutAsync(JsonConvert.SerializeObject(request));

                result.Success = true;
            }

            return result;
        }

        public async Task<Song> Buscar(string id)
        {
            Song musica = null;

            if (!string.IsNullOrEmpty(id))
            {
                musica = await _firebaseClient.Child(_songsIndexDatabase).Child(id).OnceSingleAsync<Models.Song>();

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
                    await _firebaseClient.Child(_songsIndexDatabase).Child(id).DeleteAsync();

                    result.Success = true;
                }
                catch (Exception e)
                {
                    result.Message = "Ocorreu um erro durante a operação: " + e.Message;
                }
            }

            return result;
        }

        public async Task<List<Song>> Listar()
        {
            List<Song> musicas = new List<Song>();

            var result = await _firebaseClient.Child(_songsIndexDatabase).OnceAsync<Song>();

            if (result != null && result.Count > 0)
            {
                foreach (var item in result)
                {
                    Song musica = item.Object;

                    musica.Id = item.Key;

                    musicas.Add(musica);
                }
            }

            return musicas;
        }

        public async Task<List<Source>> ListarFontes()
        {
            List<Source> fontes = new List<Source>();

            try
            {
                var result = await _firebaseClient.Child(_sourcesIndexDatabase).OnceAsync<Source>();

                if (result != null && result.Count > 0)
                {
                    foreach (var item in result)
                    {
                        Source fonte = item.Object;

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

        public async Task<Source> BuscarFonte(string id)
        {
            Source fonte = null;

            if (!string.IsNullOrEmpty(id))
            {
                fonte = await _firebaseClient.Child(_sourcesIndexDatabase).Child(id).OnceSingleAsync<Source>();

                fonte.Id = id;
            }

            return fonte;
        }

        public async Task<BaseResult> AdicionarRelacao(PeriodicSet request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    request.IssueDate = DateTime.Now;

                    await _firebaseClient.Child(_musicSetsIndexDatabase).PostAsync(JsonConvert.SerializeObject(request));

                    result.Success = true;
                }
                catch (Exception e)
                {
                    
                }
            }

            return result;
        }

        public async Task<PeriodicSet> BuscarRelacao(string id)
        {
            PeriodicSet relacao = null;

            if (!string.IsNullOrEmpty(id))
            {
                relacao = await _firebaseClient.Child(_musicSetsIndexDatabase).Child(id).OnceSingleAsync<PeriodicSet>();

                if (relacao != null && relacao.MusicSet != null && relacao.MusicSet.Count > 0)
                {
                    foreach (var relacaoMusical in relacao.MusicSet)
                    {
                        if (relacaoMusical.Songs != null && relacaoMusical.Songs.Count > 0)
                        {
                            foreach (var musica in relacaoMusical.Songs)
                            {
                                var result = await Buscar(musica.Id);

                                musica.Name = result.Name;
                                musica.Author = result.Author;
                                musica.Page = result.Page;
                                musica.Edition = result.Edition;
                            }
                        }
                    }
                }
            }

            return relacao;
        }

        public async Task<List<PeriodicSet>> ListarRelacoes()
        {
            var result = new List<PeriodicSet>();

            try
            {
                var relacoes = await _firebaseClient.Child(_musicSetsIndexDatabase).OnceAsync<PeriodicSet>();

                if (relacoes != null && relacoes.Count > 0)
                {
                    foreach (var relacao in relacoes)
                    {
                        PeriodicSet relacaoPeriodica = relacao.Object;

                        relacaoPeriodica.Type = ESetType.MUSIC;
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
            var fontes = new List<Source>
            {
                new Source { Name = "Cifras IBET 1º Edição", Type = ESourceType.MUSIC },
                new Source { Name = "Cantor Cristão", Type = ESourceType.MUSIC },
                new Source { Name = "Voz de Melodia", Type = ESourceType.MUSIC }
            };

            foreach (var item in fontes)
                await _firebaseClient.Child(_sourcesIndexDatabase).PostAsync(item);

            return true;
        }

        public async Task<bool> InserirMusicas()
        {
            var currentSongs = await _firebaseClient.Child("Musicas").OnceAsync<Models.Musica>();

            if (currentSongs != null && currentSongs.Count > 0)
            {
                var newSongs = new List<Song>();

                foreach (var song in currentSongs)
                {
                    var songToAdd = new Song
                    {
                        Name = song.Object.Nome,
                        Source = new Source 
                        {
                            Id = song.Object.Fonte != null ? song.Object.Fonte.Id : string.Empty,
                            Name = song.Object.Fonte != null ? song.Object.Fonte.Nome : string.Empty,
                            Type = ESourceType.MUSIC
                        },
                        Author = song.Object.Autor,
                        Page = song.Object.Pagina,
                        Edition = song.Object.Edicao
                    };

                    newSongs.Add(songToAdd);
                }

                if (newSongs.Count > 0 && newSongs.Count == currentSongs.Count)
                {
                    foreach (var item in newSongs)
                    {
                        await _firebaseClient.Child("Songs").PostAsync(item);
                    }
                }
            }

            return true;
        }
    }
}
