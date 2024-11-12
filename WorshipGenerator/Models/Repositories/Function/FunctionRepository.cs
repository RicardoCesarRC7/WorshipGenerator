using Firebase.Database;
using Firebase.Database.Query;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Models.Base;

namespace WorshipGenerator.Models.Repositories.Function
{
    public class FunctionRepository : IFunctionRepository
    {
        private readonly string _firebaseUrl;
        private readonly string _functionsIndexDatabase;
        private readonly FirebaseClient _firebaseClient;

        private readonly IConfiguration _configuration;

        public FunctionRepository(IConfiguration configuration)
        {
            _configuration = configuration;

            if (_configuration != null)
            {
                _firebaseUrl = configuration["firebaseMainUrl"];

                _firebaseClient = new FirebaseClient(_firebaseUrl);

                _functionsIndexDatabase = configuration["functionsIndexDatabase"];
            }
        }

        public async Task<List<ChurchFunction>> ListAll()
        {
            List<ChurchFunction> result = new List<ChurchFunction>();

            try
            {
                var response = await _firebaseClient.Child(_functionsIndexDatabase).OnceAsync<ChurchFunction>();

                if (response != null && response.Count > 0)
                {
                    foreach (var item in response)
                    {
                        ChurchFunction function = item.Object;

                        function.Id = item.Key;

                        result.Add(function);
                    }
                }
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<List<ChurchFunction>> List(string departmentId)
        {
            List<ChurchFunction> result = new List<ChurchFunction>();
            List<ChurchFunction> allFunctions = await ListAll();

            try
            {
                if (allFunctions != null && allFunctions.Count > 0)
                    result = allFunctions.Where(i => i.Department.Id == departmentId).ToList();
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<BaseResult> Add(ChurchFunction request, ChurchDepartment department)
        {
            BaseResult result = new BaseResult();

            if (request == null)
            {
                result.Message = "Request is missing";
                
                return result;
            }

            if (department == null || string.IsNullOrEmpty(department.Id))
            {
                result.Message = "Department is missing";

                return result;
            }

            try
            {
                request.Department = new ChurchDepartment() { Id = department.Id };

                await _firebaseClient.Child(_functionsIndexDatabase).PostAsync(JsonConvert.SerializeObject(request));

                result.Success = true;
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<ChurchFunction> Get(string id)
        {
            ChurchFunction result = null;

            if (!string.IsNullOrEmpty(id))
            {
                try
                {
                    result = await _firebaseClient.Child(_functionsIndexDatabase).Child(id).OnceSingleAsync<ChurchFunction>();

                    if (result != null)
                    {
                        result.Id = id;
                    }
                }
                catch (Exception e)
                {

                }
            }

            return result;
        }

        public async Task<BaseResult> Update(ChurchFunction request)
        {
            BaseResult result = new BaseResult();

            if (request == null || string.IsNullOrEmpty(request.Id))
            {
                result.Message = "Request is missing";

                return result;
            }

            if (request.Department == null)
            {
                result.Message = "Department is missing";

                return result;
            }

            try
            {
                await _firebaseClient.Child(_functionsIndexDatabase).Child(request.Id).PutAsync(JsonConvert.SerializeObject(request));

                result.Success = true;
            }
            catch (Exception e)
            {

            }

            return result;
        }

        public async Task<BaseResult> Remove(string id)
        {
            BaseResult result = new BaseResult();

            if (!string.IsNullOrEmpty(id))
            {
                await _firebaseClient.Child(_functionsIndexDatabase).Child(id).DeleteAsync();

                result.Success = true;
            }

            return result;
        }
    }
}
