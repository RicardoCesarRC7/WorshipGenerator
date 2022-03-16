using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models.Repositories.Programacao
{
    public interface IProgramacaoRepository
    {
        Task<Models.Programacao> Get(string id);
        Task<List<Models.Programacao>> ListAll();
    }
}
