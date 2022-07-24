using Naraakum.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace Naraakum.WebAPI
{
    public class AuthAPI: BaseWebAPI
    {
        public static AuthToken Authenticate()
        {
            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "7a6b79797d65786e"),
                new KeyValuePair<string, string>("apikey", "333b394f3c3f4c3d27484b3e4c273e3f383d27323d393c274f394f383c3a3e4e4f493b3b"),
                new KeyValuePair<string, string>("platformId", "3b")
            });
            var data = GetResponse(content, "token");
            return data.DeserializeObject<AuthToken>();
        }
    }
}
