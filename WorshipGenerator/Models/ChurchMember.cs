using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models
{
    public class ChurchMember
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public int Age { get; set; }
        public DateTime BirthDate { get; set; }
        public string CPF { get; set; }
        public string RG { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Cellphone { get; set; }
        public Address Address { get; set; }
        public List<ChurchDepartment> Departments { get; set; }
        public List<ChurchFunction> Functions { get; set; }
    }
}
