using System.Collections.Generic;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Musica
{
    public interface IMusicaRepository
    {
        Task<BaseResult> Adicionar(Song musica);
        Task<BaseResult> Editar(Song musica);
        Task<Song> Buscar(string id);
        Task<BaseResult> Remover(string id);
        Task<List<Song>> Listar();
        Task<List<Source>> ListarFontes();
        Task<bool> InserirFontesMusicais();
        Task<BaseResult> AdicionarRelacao(PeriodicSet relacaoMusical);
        Task<BaseResult> UpdateMusicSet(PeriodicSet request);
        Task<PeriodicSet> BuscarRelacao(string id);
        Task<List<PeriodicSet>> ListarRelacoes();
    }
}
