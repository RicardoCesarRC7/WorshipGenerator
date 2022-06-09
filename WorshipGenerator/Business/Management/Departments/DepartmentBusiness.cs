using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Department;

namespace WorshipGenerator.Business.Management.Departments
{
    public class DepartmentBusiness : IDepartmentBusiness
    {
        private readonly IDepartmentRepository _departmentRepository;

        public DepartmentBusiness(IDepartmentRepository departmentRepository)
        {
            _departmentRepository = departmentRepository;
        }

        public async Task<List<ChurchDepartment>> List()
        {
            return await _departmentRepository.List();
        }

        public async Task<BaseResult> Add(ChurchDepartment request)
        {
            return await _departmentRepository.Add(request);
        }

        public async Task<ChurchDepartment> Get(string id)
        {
            return await _departmentRepository.Get(id);
        }

        public async Task<BaseResult> Update(ChurchDepartment request)
        {
            return await _departmentRepository.Update(request);
        }

        public async Task<BaseResult> Remove(string id)
        {
            return await _departmentRepository.Remove(id);
        }
    }
}
