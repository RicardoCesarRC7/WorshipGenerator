namespace WorshipGenerator.Models.Base
{
    public class BaseResult
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public object Content { get; set; }
    }
}
