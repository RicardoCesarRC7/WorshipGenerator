namespace WorshipGenerator.Models
{
    public class ChurchFunction
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ChurchDepartment Department { get; set; }
    }
}
