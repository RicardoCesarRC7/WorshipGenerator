using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models
{
    public class RelacaoMusical
    {
        public DateTime Data { get; set; }
        public List<Musica> Musicas { get; set; }
    }
}
