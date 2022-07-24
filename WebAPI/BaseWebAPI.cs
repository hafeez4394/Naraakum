using Naraakum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace Naraakum.WebAPI
{
    public class BaseWebAPI
    {
        protected static object GetResponse(HttpContent content, string apiMethod, bool isAuthRequired = false)
        {
            var client = new HttpClient();

            client.BaseAddress = new Uri("https://hhcnode.innotech-sa.com/api/authValidator/token");  //CacheManager.APIUrl

            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            //if (isAuthRequired)
            //{
            //    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(CacheManager.WebAPIAccessTokenType, CacheManager.WebAPIAccessToken);
            //}

            var httpResponse = client.PostAsync(apiMethod, content).Result;
            var data = httpResponse.Content.ReadAsStringAsync().Result;

            return data.DeserializeObject<object>();
        }
    }
}
