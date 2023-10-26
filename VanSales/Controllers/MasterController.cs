using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using VanSale.LogDetails;
using VanSale.Models;
using VanSale.ViewModels;
using VanSales.Controllers;
using VanSales.Models;

namespace VanSale.Controllers
{
    public class MasterController : Controller
    {

        string api = "";
        private object json;
        string logpath = "";
        Logs l = new Logs();
        static DataTable dt, dtReports, dtMasterReports;

        private readonly ILogger<MasterController> _logger;
        public IConfiguration configuration;
        //rdlpath = "";
        HttpClientHandler _clientHandler = new HttpClientHandler();
        private readonly IWebHostEnvironment hostingEnvironment;

        private SummaryDatatable summaryDataModel;
        private List<SummaryDatatable> _ndataSummary;
        private List<AutoCompleteParameters> _nAutoCompleteParameters;
        public MasterController(ILogger<MasterController> logger, IConfiguration iConfig, IWebHostEnvironment hostingEnvironment)
        {
            _logger = logger;
            configuration = iConfig;
            api = configuration["API"];
            logpath = configuration["logpath"];
            this.hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Masters(int id)
        {
           
            int uid = Convert.ToInt32(User.FindFirst("UserId").Value);
            string uname = User.FindFirst("Username").Value;

            // return View(viewModel);
            // Define a dictionary to map id values to view names
            var viewMappings = new Dictionary<int, (string ViewName, string Title)>
            {
                 {5, ("Customer", "Customer ")},
                 {2, ("Outlet", "Outlet ")},
                 {9, ("Home", "Bank ") },
                 {8, ("Home", "Location") },
                 {6,("WareHouse","WareHouse")},
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

        #region VanSalesMasters

     

        [HttpPost]
        public async Task<string> Post(string obj, string sAPIName)
        {
            var response = string.Empty;
            try
            {
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    var stringContent = new StringContent(obj, System.Text.UnicodeEncoding.UTF8, "application/json");
                    StringContent newobj = stringContent;
                    var client = new HttpClient();
                    HttpResponseMessage result = await httpClient.PostAsync(api + sAPIName, stringContent);
                    //if (result.IsSuccessStatusCode)
                    //{
                    string responseContent = await result.Content.ReadAsStringAsync();
                    response = responseContent;
                    
                }
                return response;
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n " + ex.ToString(), logpath);
                return response;
            }
        }

       
        public async Task<JsonResult> MasterSummaryDataTable(JqueryDatatableParam param, string sAPIName, int iMaster, int iParent)
        {
           
       
            try
            {
                int iUId = 0;

                if (User.Identity.IsAuthenticated)
                {
                    iUId = Convert.ToInt32(User.FindFirst("UserId").Value);
                }

                if (string.IsNullOrEmpty(param.sSearch))
                {
                    param.sSearch = "";
                }
                _ndataSummary = new List<SummaryDatatable>();
                string apiUrl = $"{api}{sAPIName}?DisplayLength={param.iDisplayLength}&DisplayStart={param.iDisplayStart}&iUserId={iUId}&Search={param.sSearch}";
                if (iParent != 0)
                {
                    apiUrl += $"&iParent={iParent}";
                }
                if (iMaster != 0)
                {
                    apiUrl += $"&iMaster={iMaster}";
                }
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using (var response = await httpClient.GetAsync(apiUrl))
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        _ndataSummary = JsonConvert.DeserializeObject<List<SummaryDatatable>>(apiResponse);
                    }
                }
                var totalRecords = _ndataSummary.Count > 0 ? _ndataSummary[0].totalRows : 0;
                return Json(new
                {
                    iTotalRecords = totalRecords,
                    iTotalDisplayRecords = totalRecords,
                    data = _ndataSummary
                });
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog($"{GetType().Name}\n Method: {actionName}\n{ex.ToString()}", logpath);
                var totalRecords = _ndataSummary.Count > 0 ? _ndataSummary[0].totalRows : 0;
                return Json(new
                {
                    iTotalRecords = totalRecords,
                    iTotalDisplayRecords = totalRecords,
                    data = _ndataSummary
                });
            }
        }


        [HttpGet]
       
        public async Task<IActionResult> GetDetails(string sAPIName, Dictionary<string, string> queryParameters = null)
        {
           var relativeUrl = sAPIName;
            try
            {
                if (queryParameters != null && queryParameters.Any())
                {
                    var queryString = string.Join("&", queryParameters.Select(kvp => $"{kvp.Key}={kvp.Value}"));
                    relativeUrl = $"{relativeUrl}?{queryString}";
                }

                int iId = 0, iMaster = 0;
                if (queryParameters != null)
                {
                    if (queryParameters.TryGetValue("iId", out string iIdValue))
                    {
                        iId = int.Parse(iIdValue);
                    }
                    if (queryParameters.TryGetValue("iMaster", out string iMasterValue))
                    {
                        iMaster = int.Parse(iMasterValue);
                    }
                }


                    using (var httpClient = new HttpClient(_clientHandler))
                    {
                        var apiUrl = api + sAPIName;
                        if (iId > 0)
                        {
                            apiUrl = api + sAPIName + "?iId=" + iId;
                        }
                        else
                        {
                            apiUrl = api + sAPIName;//GetDecimalSettings
                        }
                        if (iMaster != 0)
                        {
                            apiUrl += "&iMaster=" + iMaster;
                        }
                        using (var response = await httpClient.GetAsync(apiUrl))
                        {
                            if (response.IsSuccessStatusCode)
                            {
                                string apiResponse = await response.Content.ReadAsStringAsync();
                                string resultDataJson = JObject.Parse(apiResponse)["ResultData"].ToString();
                                // Deserialize the "ResultData" JSON                           
                                var responseData = JsonConvert.DeserializeObject<dynamic>(resultDataJson);
                                return Json(responseData);
                            }
                            else
                            {
                                return StatusCode((int)response.StatusCode, "Failed");
                            }
                        }
                    }
                
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\n Method:" + actionName + "\n" + ex.ToString(), logpath);
                return StatusCode(500, "An error occurred.");
            }
        }

        //public async Task<string> Delete(string sAPIName, string iId, int iUser, int iMaster)
        public async Task<string> Delete(string sAPIName, Dictionary<string, string> queryParameters = null)
        {
            try
            {
                string baseUrl = api;
                string endpoint = sAPIName;
                int iUser=0, iMaster = 0;
                string iId = "";
                if (queryParameters != null)
                {
                    if (queryParameters.TryGetValue("iId", out string iIdValue))
                    {
                        iId = iIdValue;
                    }
                    if (queryParameters.TryGetValue("iUser", out string iUserValue))
                    {
                        iUser = int.Parse(iUserValue);
                    }
                    if (queryParameters.TryGetValue("iMaster", out string iMasterValue))
                    {
                        iMaster = int.Parse(iMasterValue);
                    }
                }
                // Construct query parameters
                var queryParams = new List<string>
                {
                     $"iId={iId}",
                     $"iUserId={iUser}"
                };
                if (iMaster != 0)
                {
                    queryParams.Add($"iMaster={iMaster}");
                }
               
                string queryString = string.Join("&", queryParams);
                string requestUri = $"{baseUrl}{endpoint}?{queryString}";
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using (var response = await httpClient.GetAsync(requestUri))
                    {
                        if (response.IsSuccessStatusCode)
                        {
                            return await response.Content.ReadAsStringAsync();
                        }
                        else
                        {
                            return await response.Content.ReadAsStringAsync();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog($"{GetType().Name}\nMethod: {actionName}\n{ex.ToString()}", logpath);
                return "Error";
            }
        }

        [HttpGet]
        public async Task<List<AutoCompleteParameters>> GetAutoComplete(string sAPIName, string sSearchValue, int iType, int iId, string TagName, int iMaster)
        {
            try
            {
                string _sAPIFullPath = api + sAPIName;
                if (sAPIName == "GetParentMaster")
                {
                    _sAPIFullPath += "?iMaster=" + iMaster;
                }
                else //if(sAPIName == "GetParentCustomer" || sAPIName == "GetCustomerType" )
                {
                    _sAPIFullPath += "?iType=" + iType;

                }
                if (TagName == "#sParent" || TagName == "#Parent")
                {
                    _sAPIFullPath += "&iId=" + iId;
                }
                //if(sAPIName == "GetParentOutlet" || sAPIName == "GetParentProduct")
                //{
                //    _sAPIFullPath += "?iId=" + iId;
                //}

                _sAPIFullPath += "&sSearch=" + sSearchValue;

                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using var response = await httpClient.GetAsync(_sAPIFullPath);

                    if (response.IsSuccessStatusCode)
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var jsonResponse = JObject.Parse(apiResponse);
                        if (jsonResponse.ContainsKey("ResultData"))
                        {
                            // Extract the array from the "ResultData" field
                            var resultData = jsonResponse["ResultData"].ToString();
                            var autoCompleteParameters = JsonConvert.DeserializeObject<List<AutoCompleteParameters>>(resultData);
                            return autoCompleteParameters;
                        }
                    }
                    return null;
                }
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
                return null;
            }
        }

        #endregion

        #region TreeView
        [HttpGet]
        public async Task<IActionResult> GetTreeData(string sAPIName, int iParentId, int iMaster)
        {
            string _sAPIFullPath = api + sAPIName + "?iParentId=" + iParentId + "&iMaster=" + iMaster;

            try
            {
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using var response = await httpClient.GetAsync(_sAPIFullPath);
                    if (response.IsSuccessStatusCode)
                    {
                        string apiResponse = await response.Content.ReadAsStringAsync();
                        var jsonResponse = JObject.Parse(apiResponse);
                        if (jsonResponse.ContainsKey("ResultData"))
                        {
                            var resultData = jsonResponse["ResultData"].ToString();
                            var data = JsonConvert.DeserializeObject<List<TreeNode>>(resultData);

                            if (iParentId == 0)
                            {
                                // Handle the initial request for top-level nodes
                                var treeData = new List<object>();

                                // Add the root node with a specific ID and title
                                treeData.Add(new
                                {
                                    id = 0, // Unique ID for the root node
                                    text = "WareHouse", // Replace with the title of your root node
                                    children = data
                                        .Where(node => node.iParentId == 0)
                                        .Select(node => new
                                        {
                                            id = node.iId,
                                            text = node.sName,
                                            children = true,
                                            bGroup = node.bGroup
                                        }),
                                });

                                return Json(treeData);
                            }
                            else
                            {
                                // Handle the request for child nodes
                                var childNodes = data
                                    .Where(node => node.iParentId == iParentId)
                                    .Select(node => new
                                    {
                                        id = node.iId,
                                        text = node.sName,
                                        children = true,
                                        bGroup = node.bGroup
                                    });

                                return Json(childNodes);
                            }
                        }
                    }
                    return Json(new object[] { });
                }
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
                return null;
            }
        }



        [HttpGet]
        //using this api updating node position when drag and drop occur & setProperty also setting 
        public async Task<IActionResult> UpdateData(string sAPIName, int iParentId, string iId, int? iMenuId = 0, int? iStatus = 0)
        {
            string apiResponse = string.Empty;
            try
            {
                var apiUrl = api + sAPIName;
                if (iStatus != 0)
                {
                    apiUrl += "?iId=" + iId + "&iStatus=" + iStatus + "&iMenuId=" + iMenuId;
                }
                else
                {
                    apiUrl += "?iParentId=" + iParentId + "&iId=" + iId + "&iMenuId=" + iMenuId;
                }
                using (var httpClient = new HttpClient(_clientHandler))
                {
                    using (var response = await httpClient.GetAsync(apiUrl))
                    {

                        if (response.IsSuccessStatusCode)
                        {
                            apiResponse = await response.Content.ReadAsStringAsync();

                            return Json(apiResponse);
                        }
                        else
                        {
                            apiResponse = await response.Content.ReadAsStringAsync();

                            return Json(apiResponse);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMathod:" + actionName + "\n" + ex.ToString(), logpath);
                return null;
            }
        }
        #endregion





        #region Excel
        public async Task<DataTable> ExportDatatable1(string sAPIName)
        {
            var licenseContext = configuration["EPPlus:ExcelPackage.LicenseContext"];
            int uid = Convert.ToInt32(User.FindFirst("UserId").Value);
            //  string apiUrl = api + sAPIName + "?iParentId=" + iParentId + "&iMaster=" + iMaster;
            string apiUrl = $"{api}{sAPIName}?DisplayLength={0}&DisplayStart={0}&iUserId={uid}&iParentId{0}&Search={null}";
            try
            {

                using (var httpClient = new HttpClient(_clientHandler))
                {

                    httpClient.Timeout = TimeSpan.FromSeconds(1000);
                    using var response = await httpClient.GetAsync(apiUrl);

                    string apiResponse = await response.Content.ReadAsStringAsync();
                    //var responseObject = JsonConvert.DeserializeObject<JObject>(apiResponse);
                    //var resultDataJson = responseObject["ResultData"].ToString();
                    dtMasterReports = (DataTable)JsonConvert.DeserializeObject(apiResponse, (typeof(DataTable)));

                }
                return dtMasterReports;
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
                return dtMasterReports;
            }
        }


        public Task<FileStreamResult> ExportExcelForMaster(string sAPIName)
        {
            Task<DataTable> task = ExportDatatable1(sAPIName);

            return GenerateAllExcel(task.Result);

        }

        public async Task<FileStreamResult> GenerateAllExcel(DataTable dt)
        {
            string sTitle = "Master";
            var contentType = "application/octet-stream";
            var fileName = sTitle + DateTime.Now.ToString("dd-MM-yyyy_hh-mm-ss") + ".xlsx";
            var stream = new MemoryStream();
            //stream.WriteTimeout = 5000; // Set a write timeout of 5 seconds (5000 milliseconds).
            //stream.ReadTimeout = 5000; // Set a read timeout of 5 seconds (5000 milliseconds).

            try
            {
                ExcelRange cell;
                using (var excelPackage = new ExcelPackage(stream))
                {
                    {
                        excelPackage.Workbook.Properties.Author = "Sang";
                        excelPackage.Workbook.Properties.Title = "Sang";
                        ExcelWorksheet sheet = excelPackage.Workbook.Worksheets.Add("Excel");
                        sheet.Name = sTitle;
                        sheet.DefaultColWidth = 15;
                        int l = dt.Columns.Count;
                        // l = 0;
                        sheet.Cells["A1"].LoadFromText(sTitle);
                        sheet.Cells[1, 1, 1, l].Merge = true;
                        cell = sheet.Cells[1, 1];
                        cell.Style.Font.Bold = true;
                        cell.Style.Font.Size = 20;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        sheet.Cells["A2"].LoadFromText("");
                        sheet.Cells[2, 1, 2, l].Merge = true;
                        cell = sheet.Cells[2, 1];
                        cell.Style.Font.Size = 15;
                        cell.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        // if (dt.Result.Rows.Count > 0)
                        if (dt.Rows.Count > 0)
                        {
                            sheet.Cells["A3"].LoadFromDataTable(dt, true);
                            sheet.Cells[3, 1, 3, l].Style.Font.Bold = true;
                            sheet.Columns.AutoFit();
                        }
                        else
                        {
                            sheet.Cells["A3"].LoadFromText("No Data Found");//titl
                        }

                        excelPackage.Save();

                    };
                    stream.Position = 0;
                    return File(stream, contentType, fileName);

                }
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n" + ex.ToString(), logpath);
                stream = new MemoryStream();
                using (var excelPackage = new ExcelPackage(stream))
                {
                    excelPackage.Workbook.Properties.Author = "Sang";
                    excelPackage.Workbook.Properties.Title = "Sang";
                    var sheet = excelPackage.Workbook.Worksheets.Add("Excel");
                    sheet.Name = "Excel Report";
                    sheet.DefaultColWidth = 20;

                    sheet.Cells["A1"].LoadFromText("No Data Found");
                    sheet.Cells[1, 1].Merge = true;

                    excelPackage.Save();
                };
                stream.Position = 0;
                return File(stream, contentType, fileName);


            }
        }




        #endregion

    }


}
