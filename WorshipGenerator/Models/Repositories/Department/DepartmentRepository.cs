using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Business.Management.Functions;
using WorshipGenerator.Models.Base;
using WorshipGenerator.Models.Repositories.Function;

namespace WorshipGenerator.Models.Repositories.Department
{
    public class DepartmentRepository : IDepartmentRepository
    {
        private readonly string _firebaseUrl;
        private readonly string _departmentsIndexDatabase;
        private readonly FirebaseClient _firebaseClient;

        private readonly IFunctionBusiness _functionBusiness;
        private readonly IConfiguration _configuration;

        public DepartmentRepository(IFunctionBusiness functionBusiness, IConfiguration configuration)
        {
            _configuration = configuration;
            _functionBusiness = functionBusiness;

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

                        department.Functions = await _functionBusiness.List(department.Id);

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
                            await _functionBusiness.Add(function, request);
                    }

                    result.Success = true;
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }

        public async Task<ChurchDepartment> Get(string id)
        {
            ChurchDepartment result = null;

            if (!string.IsNullOrEmpty(id))
            {
                try
                {
                    result = await _firebaseClient.Child(_departmentsIndexDatabase).Child(id).OnceSingleAsync<ChurchDepartment>();

                    if (result != null)
                    {
                        result.Id = id;

                        result.Functions = await _functionBusiness.List(id);
                    }
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
                            if (!string.IsNullOrEmpty(function.Id))
                                await _functionBusiness.Update(function);
                            else
                                await _functionBusiness.Add(function, request);
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
