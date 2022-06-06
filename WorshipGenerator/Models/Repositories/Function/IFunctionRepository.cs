using System.Collections.Generic;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Function
{
    public interface IFunctionRepository
    {
        Task<List<ChurchFunction>> ListAll();
        Task<List<ChurchFunction>> List(string departmentId);
        Task<BaseResult> Add(ChurchFunction request, ChurchDepartment department);
        Task<BaseResult> Update(ChurchFunction request);
        Task<BaseResult> Remove(string id);
    }
}
