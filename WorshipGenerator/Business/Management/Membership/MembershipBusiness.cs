using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Membership;

namespace WorshipGenerator.Business.Management.Membership
{
    public class MembershipBusiness : IMembershipBusiness
    {
        private readonly IMembershipRepository _membershipRepository;

        public MembershipBusiness(IMembershipRepository membershipRepository) 
        {
            _membershipRepository = membershipRepository;
        }

        public async Task<List<ChurchMember>> List()
        {
            return await _membershipRepository.List();
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
