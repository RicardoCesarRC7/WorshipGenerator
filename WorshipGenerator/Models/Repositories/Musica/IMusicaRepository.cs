using System.Collections.Generic;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Musica
{
    public interface IMusicaRepository
    {
        Task<BaseResult> Adicionar(Models.Musica musica);
        Task<List<Models.Musica>> Listar();
        Task<BaseResult> AdicionarRelacao(RelacaoPeriodica relacaoMusical);
        Task<RelacaoPeriodica> BuscarRelacao(string id);
        Task<List<Models.RelacaoPeriodica>> ListarRelacoes();
    }
}
