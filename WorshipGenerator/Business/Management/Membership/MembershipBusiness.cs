using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Business.Management.Departments;
using WorshipGenerator.Business.Management.Functions;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Membership;

namespace WorshipGenerator.Business.Management.Membership
{
    public class MembershipBusiness : IMembershipBusiness
    {
        private readonly IMembershipRepository _membershipRepository;

        private readonly IDepartmentBusiness _departmentBusiness;
        private readonly IFunctionBusiness _functionBusiness;

        public MembershipBusiness(IMembershipRepository membershipRepository, IDepartmentBusiness departmentBusiness, IFunctionBusiness functionBusiness) 
        {
            _membershipRepository = membershipRepository;

            _departmentBusiness = departmentBusiness;
            _functionBusiness = functionBusiness;
        }

        public async Task<List<ChurchMember>> List()
        {
            return await _membershipRepository.List();
        }

        public async Task<List<ChurchMember>> ListByDepartment(string departmentId)
        {
            List<ChurchMember> result = new List<ChurchMember>();

            List<ChurchMember> allMembers = await _membershipRepository.List();

            if (allMembers != null && allMembers.Count > 0)
            {
                ChurchDepartment department =  await _departmentBusiness.Get(departmentId);

                if (department != null && department.Functions != null)
                {
                    try
                    {
                        List<string> functionIds = department.Functions.Select(i => i.Id).ToList();

                        result = allMembers.Where(i => i.Functions != null && i.Functions.Any(ii => functionIds.Contains(ii.Id))).ToList();
                    }
                    catch (Exception e)
                    {

                    }
                }
            }

            return result;
        }

        public async Task<BaseResult> Add(ChurchMember request)
        {
            return await _membershipRepository.Add(request);
        }

        public async Task<BaseResult> Update(ChurchMember request)
        {
            return await _membershipRepository.Update(request);
        }

        public async Task<BaseResult> Remove(string id)
        {
            return await _membershipRepository.Remove(id);
        }
    }
}
