using System.Collections.Generic;

namespace WorshipGenerator.Models
{
    public class ChurchDepartment
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsSubDepartment { get; set; }
        public List<ChurchFunction> Functions { get; set; }
        public List<ChurchDepartment> Departments { get; set; }
    }
}
