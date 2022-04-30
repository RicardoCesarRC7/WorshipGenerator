using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Membership
{
    public class MembershipRepository : IMembershipRepository
    {
        private readonly string _firebaseUrl;
        private readonly string _membersIndexDatabase;
        private readonly FirebaseClient _firebaseClient;

        private readonly IConfiguration _configuration;

        public MembershipRepository(IConfiguration configuration)
        {
            _configuration = configuration;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);

                _membersIndexDatabase = configuration["membersIndexDatabase"];
            }
        }

        public async Task<List<ChurchMember>> List()
        {
            List<ChurchMember> result = new List<ChurchMember>();

            try
            {
                var response = await _firebaseClient.Child(_membersIndexDatabase).OnceAsync<ChurchMember>();

                if (response != null && response.Count > 0)
                {
                    foreach (var item in response)
                    {
                        ChurchMember member = item.Object;

                        member.Id = item.Key;

                        result.Add(member);
                    }
                }
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<BaseResult> Add(ChurchMember request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    await _firebaseClient.Child(_membersIndexDatabase).PostAsync(JsonConvert.SerializeObject(request));

                    result.Success = true;
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }

        public async Task<BaseResult> Update(ChurchMember request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    await _firebaseClient.Child(_membersIndexDatabase).Child(request.Id).PutAsync(JsonConvert.SerializeObject(request));

                    result.Success = true;
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }

        public async Task<BaseResult> Remove(string id)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(id))
            {
                try
                {
                    await _firebaseClient.Child(_membersIndexDatabase).Child(id).DeleteAsync();

                    result.Success = true;
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }
    }
}
