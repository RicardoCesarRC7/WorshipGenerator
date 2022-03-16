using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models
{
    public class Programacao
    {
        public Programacao() { }

        public string Id { get; set; }
        public string Local { get; set; }
        public DateTime Data { get; set; }
        public string Hora { get; set; }
        public List<Momento> Momentos { get; set; }
    }

    public class Momento
    {
        public Momento() { }

        public string Nome { get; set; }
        public string Responsavel { get; set; }
    }
}
