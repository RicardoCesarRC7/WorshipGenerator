using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Function;

namespace WorshipGenerator.Business.Management.Functions
{
    public class FunctionBusiness : IFunctionBusiness
    {
        private readonly IFunctionRepository _functionRepository;

        public FunctionBusiness(IFunctionRepository functionRepository)
        {
            _functionRepository = functionRepository;
        }

        public async Task<List<ChurchFunction>> ListAll()
        {
            return await _functionRepository.ListAll();
        }

        public async Task<List<ChurchFunction>> List(string departmentId)
        {
            return await _functionRepository.List(departmentId);
        }

        public async Task<BaseResult> Add(ChurchFunction request, ChurchDepartment department)
        {
            return await _functionRepository.Add(request, department);
        }

        public async Task<ChurchFunction> Get(string id)
        {
            return await _functionRepository.Get(id);
        }

        public async Task<BaseResult> Update(ChurchFunction request)
        {
            return await _functionRepository.Update(request);
        }

        public async Task<BaseResult> Remove(string id)
        {
            return await _functionRepository.Remove(id);
        }
    }
}
