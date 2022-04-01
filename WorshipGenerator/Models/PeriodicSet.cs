using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Enums;

namespace WorshipGenerator.Models
{
    public class PeriodicSet
    {
        public string Id { get; set; }
        public string Author { get; set; }
        public ESetType Type { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public List<MusicSet> MusicSet { get; set; }
        public DateTime IssueDate { get; set; }
    }
}
