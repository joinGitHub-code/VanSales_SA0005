using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System;
using System.Net.Http;
using VanSale.LogDetails;
using VanSale.ViewModels;
using VanSales.Controllers;

namespace VanSale.Controllers
{
    public class TransactionController : Controller
    {
        string baseUrl = "";
        private readonly ILogger<TransactionController> _logger;
        string logpath = "";
        private object json;
        //rdlpath = "";
        HttpClientHandler _clientHandler = new HttpClientHandler();
        public IConfiguration configuration;
        Logs l = new Logs();
        private readonly IWebHostEnvironment hostingEnvironment;
        public TransactionController(ILogger<TransactionController> logger, IConfiguration iConfig, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            configuration = iConfig;
            baseUrl = configuration["API"];
            logpath = configuration["logpath"];
            // rdlpath = configuration["rdlpath"];
            this.hostingEnvironment = hostingEnvironment;
        }
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Home(int id) {
            int uid = Convert.ToInt32(User.FindFirst("UserId").Value);
            string uname = User.FindFirst("Username").Value;
            
            // Define a dictionary to map id values to view names
            var viewMappings = new Dictionary<int, (string ViewName, string Title)>
            {
                 {1, ("Customer", "Customer ")},
                 {2, ("Outlet", "Outlet ")},
                 {9, ("Home", "Bank ") },
                 {5, ("Request", "Order") },
                 {6,("Request","Request")},
                 {14,("Home","Company")},
                 {7,("Outlet","Outlet")},
                 {13,("Product","Product")},
                 {10,("Home","Unit")},
             };

            // Check if the id exists in the dictionary
            if (viewMappings.ContainsKey(id))
            {
                // If a matching view name is found, set ViewBag.Title based on the title in the dictionary
                var (viewName, title) = viewMappings[id];
                int menuId = Convert.ToInt32(id);
                DetailsViewModel viewModel = new DetailsViewModel
                {
                    uId = uid,
                    uName = uname,
                    title = title,
                    menuId = menuId
                };
                return View(viewName, viewModel);
            } // If no matching view is found, return a default view

            return View();
        }
    }
}
