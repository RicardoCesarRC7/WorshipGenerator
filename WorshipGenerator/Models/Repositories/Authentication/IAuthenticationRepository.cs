using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WorshipGenerator.Models.Repositories.Authentication
{
    public interface IAuthenticationRepository
    {
        object GetAccount(string email);
    }
}
