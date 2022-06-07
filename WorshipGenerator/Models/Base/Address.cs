using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models.Base
{
    public class Address
    {
        public string Place { get; set; }
        public int Number { get; set; }
        public string Complement { get; set; }
        public string ZipCode { get; set; }
    }
}
