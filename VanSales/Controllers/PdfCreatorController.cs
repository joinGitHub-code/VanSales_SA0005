using DinkToPdf.Contracts;
using DinkToPdf;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;
using System.Globalization;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json.Linq;
using System.Xml.Linq;
using System.Security.Principal;
using System;
using VanSale.LogDetails;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting.Internal;

namespace VanSale.Controllers
{
    public class PdfCreatorController : Controller
    {

        string logpath = "";
        Logs l = new Logs();

        private IConverter _converter;
        private readonly IHostEnvironment _env;
        public IConfiguration _configuration;
        private readonly ILogger<PdfCreatorController> _logger;
        public PdfCreatorController(ILogger<PdfCreatorController> logger, IConverter converter, IHostEnvironment env, IConfiguration iConfig)
        {
            _logger = logger;
            _converter = converter;
            _env = env;
            _configuration = iConfig;
            logpath = _configuration["logpath"];

        }


        [HttpPost]
        public async Task<IActionResult> CreatePdf(int iId, [FromBody] JObject data)
        {
            try {
                string mode = "customer";
                string fileName = mode +iId;
                string folderName = "gallery/" + mode.ToString().ToLower();
                if (!Directory.Exists(Path.Combine("wwwroot", folderName)))
                {
                    Directory.CreateDirectory(Path.Combine("wwwroot", folderName));
                }
                string filePath = Path.Combine(_env.ContentRootPath, "wwwroot", folderName);
                filePath = filePath + "/" + fileName + ".pdf";
                string filename = "/" + folderName + "/" + fileName + ".pdf";
                var globalSettings = new GlobalSettings
                {
                    ColorMode = ColorMode.Color,
                    Orientation = Orientation.Portrait,
                    PaperSize = DinkToPdf.PaperKind.A4Small,
                    // Margins = new MarginSettings { Top = 10 },
                    DocumentTitle = "PDF Report",
                    Out = filePath,
                };
                string cssfilePath = Path.Combine(_env.ContentRootPath, "wwwroot", "assets");
                cssfilePath += "/style.css";

                string htmlContent = GetPdf(iId, data);


                var objectSettings = new ObjectSettings
                {
                    PagesCount = true,
                    HtmlContent = htmlContent,
                    WebSettings = { DefaultEncoding = "utf-8", UserStyleSheet = cssfilePath },
                    HeaderSettings = { FontName = "Arial", FontSize = 9, Right = "Page [page] of [toPage]", Line = true },
                    FooterSettings = { FontName = "Arial", FontSize = 9, Line = true, Center = "Report Footer" }
                };
               
                var pdf = new HtmlToPdfDocument()
                {
                    GlobalSettings = globalSettings,
                    Objects = { objectSettings }
                };

                _converter.Convert(pdf);
                return Ok("Successfully created PDF document.");
            }
            catch (Exception ex)
            {
                string actionName = this.ControllerContext.RouteData.Values["action"].ToString();
                l.CreateLog(GetType().Name + "\nMethod: " + actionName + "\n " + ex.ToString(), logpath);
                return StatusCode(500, "An error occurred while generating the PDF.");
            }




        }

        private static string GetPdf(int iId, JObject customerData)
            {

                var sb = new StringBuilder();
                sb.Append(@"
        <html>
        <head>
        </head>
        <body>
            <div class='header'><h1>This is the generated PDF report!!!</h1></div>
            <table align='center'>
                <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>AltName</th>
                </tr>");

           
          //  var customer = customerData.ToObject<dynamic>();

            sb.Append(@"
            <tr>
                <td>{customer.sName}</td>
                <td>{customer.sCode}</td>
                <td>{customer.sAltName}</td>
            </tr>");

                sb.Append(@"
            </table>
        </body>
        </html>");

                return sb.ToString();
            }
        
    }
}
