using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Enums;

namespace WorshipGenerator.Models
{
    public class Source
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ESourceType Type { get; set; }
    }
}
