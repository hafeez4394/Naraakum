
using Microsoft.AspNetCore.Http;
using Naraakum.Models;
using Naraakum.WebAPI;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Web;
using Microsoft.AspNetCore.Session;
using Microsoft.Extensions.DependencyInjection;

namespace Naraakum.Manager
{
    public class CacheManager
    {

        public int value = 0;
        private static ISession _session;
        private static IHttpContextAccessor _httpContextAccessor;
        AuthToken modelnew = new AuthToken();
        
        public CacheManager(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _session = httpContextAccessor.HttpContext.Session;
        }

        public static AuthToken WebAPIAuthToken
        {
            get
            {
                var obj = _session.GetString(ServerVariable.WebAPIAuthToken);
                return obj.DeserializeObject<AuthToken>();
            }
            set
            {
                _session.SetString(ServerVariable.WebAPIAuthToken, JsonConvert.SerializeObject(AuthAPI.Authenticate()));
            }
        }

        public static string WebAPIAccessToken
        {
            get
            {
                return WebAPIAuthToken != null ? WebAPIAuthToken.access_token : string.Empty;
            }
        }

        public static string WebAPIAccessTokenType
        {
            get
            {
                return WebAPIAuthToken != null ? WebAPIAuthToken.token_type : string.Empty;
            }
        }

        public void GetWebAPIAuthToken()
        {
            if (_session.GetString(ServerVariable.WebAPIAuthToken) == null ||
                string.IsNullOrEmpty(CacheManager.WebAPIAccessTokenType) ||
                string.IsNullOrEmpty(CacheManager.WebAPIAccessToken))
            {
                var result = AuthAPI.Authenticate();
                _session.SetString(ServerVariable.WebAPIAuthToken, JsonConvert.SerializeObject(result));
                _session.SetString("OrganizationId", "1");
            }
        }

        public static dynamic GetCacheObjects()
        {
            return new
            {
                WebAPIAuthToken = CacheManager.WebAPIAuthToken,
            };
        }

    }
}