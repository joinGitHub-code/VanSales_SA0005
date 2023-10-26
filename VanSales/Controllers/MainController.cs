using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Data;
using System;
using System.Net.Http;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using VanSale.LogDetails;
using Newtonsoft.Json.Linq;
using System.Linq;
using Newtonsoft.Json;
using System.Security.Cryptography;
using VanSale.ViewModels;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using System.Security.Claims;

namespace VanSales.Controllers
{
    public class MainController : Controller
    {
        //public const string SessionUid = "uId";
        //public const string SessionUname = "Uname";
        string api = "";
        private readonly ILogger<MainController> _logger;
        string logpath = "";
        private object json;
        //rdlpath = "";
        HttpClientHandler _clientHandler = new HttpClientHandler();
        public IConfiguration configuration;
        Logs l = new Logs();
        private readonly IWebHostEnvironment hostingEnvironment;

        public MainController(ILogger<MainController>logger,IConfiguration iConfig,IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            configuration = iConfig;
            api = configuration["API"];
            logpath = configuration["logpath"];
           // rdlpath = configuration["rdlpath"];
            this.hostingEnvironment = hostingEnvironment;
        }
        public IActionResult Login()
        {
            return View();
        }
        public async Task<string> GetLogin(string sLogin, string sPass, bool RememberMe)
        {
            try
            {
                //HttpContext.Session.SetInt32(SessionUid, 0);
                DataTable dt;

                using (var httpClient = new HttpClient(_clientHandler))
                {
                    var apiUrl = $"{api}UserLogin?sLoginName={sLogin}&sPassword={sPass}";
                    var response = await httpClient.GetAsync(apiUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        // Handle non-successful HTTP responses
                        return "API request failed with status code: " + response.StatusCode;
                    }

                    string apiResponse = await response.Content.ReadAsStringAsync();
                    var json = JObject.Parse(apiResponse);
                    List<JToken> tokens = json.Children().ToList();
                    List<JToken> tokensRes = tokens[2].Children().ToList();
                    string tb = tokensRes[0].ToString();
                    dt = (DataTable)JsonConvert.DeserializeObject(tb, typeof(DataTable));

                    if (dt.Rows.Count > 0)
                    {
                        if (Convert.ToInt32(dt.Rows[0]["iId"].ToString()) >= 0)
                        {
                            var result = new DetailsViewModel
                            {
                                uId = Convert.ToInt32(dt.Rows[0]["iId"].ToString()),
                                uName = dt.Rows[0]["sUserName"].ToString(),
                                rememberMe = RememberMe
                                
                            };                         
                            SetLogin(result);                       
                            string userId = dt.Rows[0]["iId"].ToString();
                            return $"{dt.Rows[0]["iId"].ToString()},{dt.Rows[0]["UserExists"].ToString()}";
                        }
                        else
                        {
                            return $"{dt.Rows[0]["iId"].ToString()},{dt.Rows[0]["UserExists"].ToString()}";
                        }
                    }
                    else
                    {
                        return "error";
                    }
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions and log them
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
                return ex.Message;
            }
        }

      
        private async void SetLogin(DetailsViewModel result)        {
            var claims = new List<Claim>
            {
                new Claim("UserId", result.uId.ToString()),
                new Claim("Username", result.uName),
                //new Claim("OutletID", result.OutletID),
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            var authProperties = new AuthenticationProperties
            {
               
                IsPersistent = result.rememberMe,
            };
                      
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                principal,
                authProperties);

            
        }

        public IActionResult Index()
        {
            //int uid = Convert.ToInt32(HttpContext.Session.GetInt32(SessionUid));
            //string uname = HttpContext.Session.GetString(SessionUname);        
           
            if (User.Identity.IsAuthenticated) {                
            
                DetailsViewModel viewModel = new DetailsViewModel
                {
                    uId = Convert.ToInt32(User.FindFirst("UserId").Value), 
                    uName = User.FindFirst("Username").Value,

                };

                return View(viewModel);
            }
            return View();
        }

        public IActionResult LogOut()
        {
            try
            {
                HttpContext.Session.Clear();
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
            }
            return RedirectToAction("Login");
        }



       

    }
}
