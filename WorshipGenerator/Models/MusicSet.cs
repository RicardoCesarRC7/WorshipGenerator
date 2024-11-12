using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models
{
    public class MusicSet : SetBase
    {
        public MusicSet(DateTime date)
        {
            Date = date;
            Songs = new List<Song>();
        }

        public List<Song> Songs { get; set; }
    }
}
