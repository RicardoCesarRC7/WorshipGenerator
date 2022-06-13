using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models
{
    public class BroadcastSet : SetBase
    {
        public BroadcastSet(DateTime date)
        {
            Date = date;
            Members = new List<ChurchMember>();
        }

        public List<ChurchMember> Members { get; set; }
    }
}
