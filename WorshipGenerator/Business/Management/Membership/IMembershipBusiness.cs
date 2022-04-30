using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Business.Management.Membership
{
    public interface IMembershipBusiness
    {
        Task<List<ChurchMember>> List();
        Task<BaseResult> Add(ChurchMember request);
        Task<BaseResult> Update(ChurchMember request);
        Task<BaseResult> Remove(string id);
    }
}
