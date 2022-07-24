using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Naraakum.Models
{
    public static class UtilityMethods
    {
        public static T DeserializeObject<T>(this object data)
        {
            return JsonConvert.DeserializeObject<T>(Convert.ToString(data));
        }
    }
}
