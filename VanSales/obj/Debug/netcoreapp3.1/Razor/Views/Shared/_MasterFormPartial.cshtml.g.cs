#pragma checksum "C:\SG Projects\VanSales New\VanSales\VanSales\Views\Shared\_MasterFormPartial.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "d0bcf92a611e7e45d2924c5e2a1e7c06e4bf720f"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Shared__MasterFormPartial), @"mvc.1.0.view", @"/Views/Shared/_MasterFormPartial.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "C:\SG Projects\VanSales New\VanSales\VanSales\Views\_ViewImports.cshtml"
using VanSales;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "C:\SG Projects\VanSales New\VanSales\VanSales\Views\_ViewImports.cshtml"
using VanSales.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"d0bcf92a611e7e45d2924c5e2a1e7c06e4bf720f", @"/Views/Shared/_MasterFormPartial.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e8bbbeab956bbc1e172d578b178f6596351129d0", @"/Views/_ViewImports.cshtml")]
    #nullable restore
    public class Views_Shared__MasterFormPartial : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    #nullable disable
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            WriteLiteral("\r\n");
            WriteLiteral("\r\n                              <div class=\"row clearfix my_gd\">\r\n                                    <div class=\"col-sm-6\">\r\n                                        <div class=\"form-group\">\r\n                                            <label");
            BeginWriteAttribute("for", " for=\"", 252, "\"", 258, 0);
            EndWriteAttribute();
            WriteLiteral(@">Name</label>
                                                <input type=""text"" id=""tName"" class="" form-control mandatory"" maxlength=""60"" autocomplete=""off"" />
                                        </div>
                                    </div>
                                       
                                      
                                        <div class=""col-sm-6"">
                                            <div class=""form-group"">
                                                <label");
            BeginWriteAttribute("for", " for=\"", 783, "\"", 789, 0);
            EndWriteAttribute();
            WriteLiteral(@">Code</label>
                                                    <input type=""text"" class=""mandatory form-control"" id=""tCode"" autocomplete=""off"" />
                                                

                                            </div>
                                        </div>
                                        <div class=""col-sm-6"">
                                            <div class=""form-group"">
                                                <label");
            BeginWriteAttribute("for", " for=\"", 1281, "\"", 1287, 0);
            EndWriteAttribute();
            WriteLiteral(">AltName</label>\r\n                                                    <input type=\"text\" class=\" form-control\"");
            BeginWriteAttribute("placeholder", " placeholder=\"", 1398, "\"", 1412, 0);
            EndWriteAttribute();
            WriteLiteral(" id=\"tAltname\" autocomplete=\"off\">\r\n            \r\n                                            </div>\r\n                                        </div>\r\n                                       \r\n");
        }
        #pragma warning restore 1998
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; } = default!;
        #nullable disable
        #nullable restore
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; } = default!;
        #nullable disable
    }
}
#pragma warning restore 1591
