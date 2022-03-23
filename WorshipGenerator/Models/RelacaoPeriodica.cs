using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Enums;

namespace WorshipGenerator.Models
{
    public class RelacaoPeriodica
    {
        public string Id { get; set; }
        public string Autor { get; set; }
        public ERelacaoTipo Tipo { get; set; }
        public DateTime De { get; set; }
        public DateTime Ate { get; set; }
        public List<RelacaoMusical> RelacoesMusicais { get; set; }
    }
}
