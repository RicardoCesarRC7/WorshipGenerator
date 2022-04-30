using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Membership
{
    public interface IMembershipRepository
    {
        Task<List<ChurchMember>> List();
        Task<BaseResult> Add(ChurchMember request);
        Task<BaseResult> Update(ChurchMember request);
        Task<BaseResult> Remove(string id);
    }
}
