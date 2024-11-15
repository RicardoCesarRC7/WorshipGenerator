﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WorshipGenerator.Business.Management.Departments;
using WorshipGenerator.Business.Management.Functions;
using WorshipGenerator.Business.Management.Membership;
using WorshipGenerator.Models;

namespace WorshipGenerator.Controllers
{
    public class ManagementController : Controller
    {
        private readonly IMembershipBusiness _membershipBusiness;
        private readonly IDepartmentBusiness _departmentBusiness;
        private readonly IFunctionBusiness _functionBusiness;

        public ManagementController(IMembershipBusiness membershipBusiness, IDepartmentBusiness departmentBusiness, IFunctionBusiness functionBusiness)
        {
            _membershipBusiness = membershipBusiness;
            _departmentBusiness = departmentBusiness;
            _functionBusiness = functionBusiness;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Membership()
        {
            return View();
        }

        public IActionResult Departments()
        {
            return View();
        }

        #region Membership CRUD Operations
        [HttpGet]
        public async Task<IActionResult> ListMembers()
        {
            return Json(await _membershipBusiness.List());
        }

        [HttpPost]
        public async Task<IActionResult> ListMembersByDepartment(string departmentId)
        {
            return Json(await _membershipBusiness.ListByDepartment(departmentId));
        }

        [HttpPost]
        public async Task<IActionResult> AddMember(ChurchMember request)
        {
            return Json(await _membershipBusiness.Add(request));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateMember(ChurchMember request)
        {
            return Json(await _membershipBusiness.Update(request));
        }

        [HttpPost]
        public async Task<IActionResult> RemoveMember(string id)
        {
            return Json(await _membershipBusiness.Remove(id));
        }
        #endregion

        #region Departments CRUD Operations
        [HttpGet]
        public async Task<IActionResult> ListDepartments()
        {
            return Json(await _departmentBusiness.List());
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment(ChurchDepartment request)
        {
            return Json(await _departmentBusiness.Add(request));
        }

        [HttpPost]
        public async Task<IActionResult> UpdateDepartment(ChurchDepartment request)
        {
            return Json(await _departmentBusiness.Update(request));
        }

        [HttpPost]
        public async Task<IActionResult> RemoveDepartment(string id)
        {
            return Json(await _departmentBusiness.Remove(id));
        }
        #endregion

        #region Functions CRUD Operations
        public async Task<IActionResult> ListAllFunctions()
        {
            return Json(await _functionBusiness.ListAll());
        }

        public async Task<IActionResult> ListFunctions(string departmentId)
        {
            return Json(await _functionBusiness.List(departmentId));
        }
        #endregion
    }
}
