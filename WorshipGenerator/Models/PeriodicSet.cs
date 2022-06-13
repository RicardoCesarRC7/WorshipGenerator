using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Enums;

namespace WorshipGenerator.Models
{
    public class PeriodicSet
    {
        public PeriodicSet() { }

        public PeriodicSet(ESetType type, DateTime from, DateTime to)
        {
            Type = type;
            From = from;
            To = to;

            if (Type == ESetType.MUSIC)
                MusicSet = new List<MusicSet>();
            else if (Type == ESetType.BROADCAST)
                BroadcastSet = new List<BroadcastSet>();
        }

        public PeriodicSet(ESetType type, string from, string to)
        {
            Type = type;
            From = Convert.ToDateTime(from);
            To = Convert.ToDateTime(to);

            if (Type == ESetType.MUSIC)
                MusicSet = new List<MusicSet>();
            else if (Type == ESetType.BROADCAST)
                BroadcastSet = new List<BroadcastSet>();
        }

        public string Id { get; set; }
        public string Author { get; set; }
        public ESetType Type { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
        public List<MusicSet> MusicSet { get; set; }
        public List<BroadcastSet> BroadcastSet { get; set; }
        public DateTime IssueDate { get; set; }

        public void GenerateDates()
        {
            DateTime currentDate = Convert.ToDateTime(From);
            DateTime to = Convert.ToDateTime(To);

            while (currentDate <= to)
            {
                if (currentDate.DayOfWeek == DayOfWeek.Sunday)
                {
                    if (Type == ESetType.MUSIC)
                    {
                        MusicSet set = new MusicSet(currentDate);

                        set.Songs.Add(new Song());

                        MusicSet.Add(set);
                    }
                    else if (Type == ESetType.BROADCAST)
                    {
                        BroadcastSet set = new BroadcastSet(currentDate);

                        set.Members.Add(new ChurchMember());

                        BroadcastSet.Add(set);
                    }

                }

                currentDate = currentDate.AddDays(1);
            }
        }
    }
}
