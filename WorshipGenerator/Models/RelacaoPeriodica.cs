using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models
{
    public class RelacaoPeriodica
    {
        public int Id { get; set; }
        public DateTime De { get; set; }
        public DateTime Ate { get; set; }
        public List<RelacaoMusical> RelacoesMusicais { get; set; }
    }
}
