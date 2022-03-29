using System.Collections.Generic;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Musica
{
    public interface IMusicaRepository
    {
        Task<BaseResult> Adicionar(Models.Musica musica);
        Task<BaseResult> Editar(Models.Musica musica);
        Task<Models.Musica> Buscar(string id);
        Task<BaseResult> Remover(string id);
        Task<List<Models.Musica>> Listar();
        Task<List<FonteMusical>> ListarFontes();
        Task<bool> InserirFontesMusicais();
        Task<BaseResult> AdicionarRelacao(RelacaoPeriodica relacaoMusical);
        Task<RelacaoPeriodica> BuscarRelacao(string id);
        Task<List<Models.RelacaoPeriodica>> ListarRelacoes();
    }
}
