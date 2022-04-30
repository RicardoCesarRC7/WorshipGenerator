using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Department
{
    public interface IDepartmentRepository
    {
        Task<List<ChurchDepartment>> List();
        Task<BaseResult> Add(ChurchDepartment request);
        Task<BaseResult> Update(ChurchDepartment request);
        Task<BaseResult> Remove(string id);
    }
}
