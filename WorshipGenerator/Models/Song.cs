using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models
{
    public class Song
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Source Source { get; set; }
        public string Author { get; set; }
        public int Page { get; set; }
        public int Edition { get; set; }
    }
}
