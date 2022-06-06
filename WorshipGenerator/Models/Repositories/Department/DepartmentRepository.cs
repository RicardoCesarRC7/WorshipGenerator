using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Function;

namespace WorshipGenerator.Models.Repositories.Department
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _firebaseUrl;
        private readonly string _departmentsIndexDatabase;
        private readonly FirebaseClient _firebaseClient;

        private readonly IFunctionRepository _functionRepository;
        private readonly IConfiguration _configuration;

        public DepartmentRepository(IFunctionRepository functionRepository, IConfiguration configuration)
        {
            _configuration = configuration;
            _functionRepository = functionRepository;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);

                _departmentsIndexDatabase = configuration["departmentsIndexDatabase"];
            }
        }

        public async Task<List<ChurchDepartment>> List()
        {
            List<ChurchDepartment> result = new List<ChurchDepartment>();

            try
            {
                var response = await _firebaseClient.Child(_departmentsIndexDatabase).OnceAsync<ChurchDepartment>();

                if (response != null && response.Count > 0)
                {
                    foreach (var item in response)
                    {
                        ChurchDepartment department = item.Object;

                        department.Id = item.Key;

                        result.Add(department);
                    }
                }
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<BaseResult> Add(ChurchDepartment request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    var response = await _firebaseClient.Child(_departmentsIndexDatabase).PostAsync(JsonConvert.SerializeObject(request));
                    
                    if (response != null && request.Functions != null && request.Functions.Count > 0)
                    {
                        request.Id = response.Key;

                        foreach (ChurchFunction function in request.Functions)
                            await _functionRepository.Add(function, request);
                    }

                    result.Success = true;
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }

        public async Task<BaseResult> Update(ChurchDepartment request)
        {
            BaseResult result = new BaseResult();

            if (request != null)
            {
                try
                {
                    await _firebaseClient.Child(_departmentsIndexDatabase).Child(request.Id).PutAsync(JsonConvert.SerializeObject(request));

                    if (request.Functions != null && request.Functions.Count > 0)
                    {
                        foreach (ChurchFunction function in request.Functions)
                        {
                            await _functionRepository.Update(function);
                        }
                    }

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
                    await _firebaseClient.Child(_departmentsIndexDatabase).Child(id).DeleteAsync();

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
