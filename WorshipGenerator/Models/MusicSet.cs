using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models
{
    public class MusicSet
    {
        public DateTime Date { get; set; }
        public List<Song> Songs { get; set; }
    }
}
