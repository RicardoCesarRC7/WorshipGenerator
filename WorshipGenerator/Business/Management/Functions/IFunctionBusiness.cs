using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Business.Management.Functions
{
    public interface IFunctionBusiness
    {
        Task<List<ChurchFunction>> ListAll();
        Task<List<ChurchFunction>> List(string departmentId);
        Task<BaseResult> Add(ChurchFunction request, ChurchDepartment department);
        Task<BaseResult> Update(ChurchFunction request);
        Task<BaseResult> Remove(string id);
    }
}
