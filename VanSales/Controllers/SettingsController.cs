using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Net.Http;
using VanSale.LogDetails;
using System;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

//using VanSale.Models;
using VanSales.Controllers;

namespace VanSale.Controllers
{
    public class SettingsController : Controller
    {
        string api = "";
        private object json;
        string logpath = "";
        Logs l = new Logs();
        public const string SessionuId = "uId";
        public const string SessionuName = "Uname";

        private readonly ILogger<SettingsController> _logger;
        public IConfiguration configuration;
        //rdlpath = "";
        HttpClientHandler _clientHandler = new HttpClientHandler();
        private readonly IWebHostEnvironment hostingEnvironment;

        public SettingsController(ILogger<SettingsController> logger, IConfiguration iConfig, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            configuration = iConfig;
            api = configuration["API"];
            logpath = configuration["logpath"];
            // rdlpath = configuration["rdlpath"];
            this.hostingEnvironment = hostingEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Settings(string id)
        {
            int Uid = Convert.ToInt32(HttpContext.Session.GetInt32(SessionuId));
            ViewBag.UID = Uid;
            ViewBag.Uname = HttpContext.Session.GetString(SessionuName);
            // Define a dictionary to map id values to view names
            var viewMappings = new Dictionary<string, string>
            {
                { "1", "User" },
                { "2", "Role" },
            };
            // Check if the id exists in the dictionary
            if (viewMappings.ContainsKey(id))
            {
                // If a matching view name is found, return that view
                return View(viewMappings[id]);
            }
            return View();
        }


        public async Task<JsonResult> GetRoleDetails(string sAPIName, int iUser)//, int iUser
        {
            try
            {

                JObject json;
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using (var response = await httpClient.GetAsync(api + sAPIName + "?iUserId=" + iUser))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        json = JObject.Parse(apiResponse);
                       
                    }
                }
                return Json(
                    json

                );
              

            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);

            }
            return Json(-1);
        }

    }
}
