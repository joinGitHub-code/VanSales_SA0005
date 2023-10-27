/// <reference path="masters/home.js" />

//DUCON Autocomplete
var SearchTypeAuto = 1;
var h = 0;
$(document).keydown(function (event) {


    if (event.which == 113) { //F2
        event.preventDefault();
        if (SearchTypeAuto == 1) {
            SearchTypeAuto = 2;
        }
        else if (SearchTypeAuto == 2) {
            SearchTypeAuto = 1;
        }
        return false;

    }
});
function DataLoadCall(sTagName, sApiName,sUrl, iMId,sDataLoadFor) {
    //API using Company
    var iCompany = $("#Company-id").val();
    var sCompany = $("#Company-id").val();
    if ((iCompany == 0) || (sCompany == "")) {
        runError("Select Company");
    }

    else {
       
           
        if (sDataLoadFor == "Account" || (sDataLoadFor == "RelatedParty")) { //Extra Tags And also for GetProduct
            DataloadMaster_Account(sTagName, sApiName, iCompany);
        }
        else if (sDataLoadFor == "Tags") {//
            DataloadForTags(sTagName, iCompany, iMId);
        }
        else if (sDataLoadFor == "Currency") {
            Dataload_Currency(sTagName, sUrl, iCompany);
        }
    }
       

}
function DataloadMaster_AccountType(TagName, sApiName,  iDoctype, iAccounttype) { // Cash/Bank And Credit Account
    //  alert("outlet" + $("#FocusBanksSelect-id").val());
    var iCompany = $("#Company-id").val();
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/FocusMaxTransaction/GetAutoCompleteAccountType",
                data: { sApiName: sApiName, sFParameter: "iCompany", sFParameterValue: iCompany, sSParameter: "iType", sSParameterValue: 1, sTParameter: "iDoctype", sTParameterValue: iDoctype, sFrParameter: "iAccounttype", sFrParameterValue: iAccounttype, sSearch: request.term },
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, sCode: item.sCode, iId: item.iId, iType: item.iType}; //, iType: item.iType
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {
                    if (iDoctype == 1 || iDoctype == 2 || iDoctype == 3) {
                        //if (ui.item.iId == $("#Bank-id").val()) {
                        //    runError("Cash/Bank and Account cannot be same")
                        //}
                        //else
                        {
                            if (($(TagName + "-id").val() != "") && ($(TagName + "-id").val() == ui.item.iId)) {
                                $(TagName).val(ui.item.sName);
                            }
                            else {
                                $(TagName).val(ui.item.sName);
                                $(TagName + "-code").val(ui.item.sCode);
                                $(TagName + "-itype").val(ui.item.iType);
                                $(TagName + "-id").val(ui.item.iId).trigger('change');
                            }
                        }
                    }
                    else if (iDoctype == 4 || iDoctype == 5) {
                        //alert("iId " + ui.item.iId);
                        //if (ui.item.iId == $("#CustVendor-id").val()) {
                        //    runError("Vendor and Account cannot be same")
                        //}
                        //else
                        {
                            if (($(TagName + "-id").val() != "") && ($(TagName + "-id").val() == ui.item.iId)) {
                                $(TagName).val(ui.item.sName);
                            }
                            else {
                                _BillWiseReferenceEdit = [];
                                //alert("_BillWiseReferenceEdit " + JSON.stringify(_BillWiseReferenceEdit))
                                $(TagName).val(ui.item.sName);
                                $(TagName + "-code").val(ui.item.sCode);
                                $(TagName + "-itype").val(ui.item.iType);
                                $(TagName + "-id").val(ui.item.iId).trigger('change');
                            }
                        }
                    }
                    
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "1050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}
function DataloadForTags(TagName, iCompany, iMId) {
   
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/FocusMaxTransaction/GetAutoCompleteTags",
                data: { sApiName: "GetTags", sFParameter: "iCompany", sFParameterValue: iCompany, sSParameter: "iType", sSParameterValue: 1, sTParameter: "iMId", sTParameterValue: iMId, sSearch: request.term},
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, sCode: item.sCode, iId: item.iId };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {


                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-code").val(ui.item.sCode);
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "1050px"); //    $("[role=listbox]").css("max-width", "250px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})

    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}

function DataloadMaster_Account(TagName, sApiName, iCompany) { // ForExtraTags like Interco ,jur etc And also for GetProduct
    //  alert("outlet" + $("#FocusBanksSelect-id").val());
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "/FocusMaxTransaction/GetAutoCompleteExtraTags",
                data: { sApiName: sApiName, sFParameter: "iCompany", sFParameterValue: iCompany, sSParameter: "iType", sSParameterValue: 1, sSearch: request.term   },
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, sCode: item.sCode, iId: item.iId };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {
                    
                   
                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-code").val(ui.item.sCode);
                    
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "1050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}

function Dataload_Company(TagName,sUrl) {
  //  alert("outlet" + $("#FocusBanksSelect-id").val());
   $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: sUrl,
                data: { apiName: "GetCompany", sFParameter: "iType", sFParameterValue: 1, sSearch: request.term  },
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, sCode: item.sCode,iId: item.iId };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {

                    //alert("cname" + ui.item.sName);
                    //alert("id" + ui.item.iId);

                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-code").val(ui.item.sCode);
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val("");

                }
            }
            return false;
        }


    })

            .data("autocomplete")._renderItem = function (ul, item) {

                $("[role=listbox]").css("overflow", "auto");
                $("[role=listbox]").css("max-height", "120px");
                $("[role=listbox]").css("max-width", "1050px");
                $("[role=listbox]").css("font-weight", "100");
                $("[role=listbox]").css("font-size", "smaller");
                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

                if (SearchTypeAuto == 1) {
                    if (h == 0) {
                        // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                        ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                    }
                    h++;
                    return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                        .data("item.autocomplete", item)
                        .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode+ "</a>")
                        .appendTo(ul);
                    // console.log(JSON.stringify(item))

                }
                else if (SearchTypeAuto == 2) {
                    if (h == 0) {
                        ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                    }
                    h++;
                    return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                      .data("item.autocomplete", item)
                      .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                      .appendTo(ul);
                }
            };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}


//For GetLayout in both MonthlyAttendance
function Dataload_ForSingleParameter(TagName, sUrl, sApiName, iType) { //iType=5 for Monthly & iType=6 for Monthly Attendance Project Wise.

    //alert("iType: " + iType)
    //alert("sApiName: " + sApiName)
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: sUrl,
                data: { sApiName: sApiName, sSearchValue: request.term, iStatus: iType },//  sFParameter: "iType", sFParameterValue: iType },
                success: function (data, res) {
                    h = 0;
                    //alert(JSON.stringify(data))
                    response($.map(data, function (item) {
                       // alert("res" + JSON.stringify(data));
                        return { sName: item.sName, sReportName: item.sReportName, iId: item.iId, sCode: item.scode, sApiName: item.sApiName };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {

                    //alert(ui.item.sName)
                    //alert(ui.item.sApiName)
                    //alert(ui.item.iId)
                    //alert(ui.item.sCode)
                    //alert(ui.item.sReportName)
                   // if (sApiName == "GetLayout") {

                        $(TagName).val(ui.item.sName);
                        $(TagName + "-apiname").val(ui.item.sApiName).trigger('change');
                        $(TagName + "-id").val(ui.item.iId);
                        $(TagName + "-code").val(ui.item.sCode);
                        $(TagName + "-rdlname").val(ui.item.sReportName);
                   // }
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $("#fExchangeRate").val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "1050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}











function DataloadMaster(TagName, surl, sApiName) {
   
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: surl,
                data: { sAPIName: sApiName, sSearchValue: request.term, iType: SearchTypeAuto, iId: copyValue(), TagName: TagName, iMaster:getMenuValue() }, //, sFParameter: "iType", iFParameterValue: iPageType, sSearchValue: request.term
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, sCode: item.sCode, iId: item.iId, sType: item.sType, iType: item.iType, sReportName: item.sReportName, sApiName: item.sApiName };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);
                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                  
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");
                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                //alert(ui.item.sName)
                if (ui.item.sName != "No Data") {

                  /*  $(TagName).attr("placeholder", "No Data");*/

                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-code").val(ui.item.sCode);

                    // alert("stype"+ui.item.sType)
                    // alert("itype"+ui.item.iType)
                    //$(sTypeTagName).val(ui.item.sType);
                    //$(sTypeTagName + "-id").val(ui.item.iType);
                }
                else {

                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val("");

                    $(sTypeTagName).val("");
                    $(sTypeTagName + "-id").val(0);


                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "1050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })
    $(TagName).on('change', function () {
        if ($(this).val() === "") {
            $(TagName).val("");
            $(TagName + "-id").val(0).trigger('change');
            
        }
    });
}
function DataloadMasterTransaction(TagName, surl, sApiName) {
    
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: surl,
                data: {
                    sAPIName: sApiName, sSearchValue: request.term, iType: SearchTypeAuto
                },
                             
                success: function (data, res) {
                    h = 0; if (data != "Error") {
                        response($.map(data, function (item) {

                            return { iId: item.iId, sName: item.sName, sCode: item.sCode };
                        }))
                    }
                    else {
                        alert("No Data");
                    }
                },
                error: function (response) {
                    ////alert(response.responseText);
                    alert("No Data");
                },
                failure: function (response) {
                    //alert(response.responseText);
                    alert("No Data");


                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {

                   // alert(TagName)
                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-code").val(ui.item.sCode)
                    //alert("txtlevel1-id" + ui.item.iId);
                    //$(sTagNameBoardCode).val(ui.item.sCode);
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-code").val(0);
                    // $(sTagNameBoardCode).val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "3050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //}
    //else {
    //    runError("Please select company");
    //}
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })
}

function DataloadMasterICP(sApiName, TagName, surl) {
    //Based on Group ,Type boarname and boardcode get loaded.
    //sTagNameGroup-> Group tagname
    //iTypeTagId-> Type tag id
    //iMaster -> 1 -> Account
    //iMaster -> 2 -> Product
    //sTagNameBoardCode -> boardcode tagname
    //  alert("DataloadMasterBoard" + sApiName)
    //  alert($("#CompanySelect-id").val());
    // if (($("#CompanySelect").val()) != "") {
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: surl,
                data: { apiName: sApiName, sSearchValue: request.term },
                /*  data: { company: parseInt($("#CompanySelect-id").val()), search: request.term, type: SearchTypeAuto },*/
                success: function (data, res) {
                    h = 0; if (data != "Error") {
                        response($.map(data, function (item) {

                            return { sName: item.sName, sCode: item.sCode };
                        }))
                    }
                    else {
                        alert("No Data");
                    }
                },
                error: function (response) {
                    ////alert(response.responseText);
                    alert("No Data");
                },
                failure: function (response) {
                    //alert(response.responseText);
                    alert("No Data");


                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {

                    // alert(ui.item.sName)
                    $(TagName).val(ui.item.sName);
                    // $(TagName + "-id").val(ui.item.iId).trigger('change');
                    //$(sTagNameBoardCode).val(ui.item.sCode);
                }
                else {
                    $(TagName).val("");
                    //$(TagName + "-id").val(0);
                   // $(sTagNameBoardCode).val("");

                }
            }
            return false;
        }


    })

        .data("autocomplete")._renderItem = function (ul, item) {

            $("[role=listbox]").css("overflow", "auto");
            $("[role=listbox]").css("max-height", "120px");
            $("[role=listbox]").css("max-width", "3050px");
            $("[role=listbox]").css("font-weight", "100");
            $("[role=listbox]").css("font-size", "smaller");
            //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
            // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

            if (SearchTypeAuto == 1) {
                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            }
            else if (SearchTypeAuto == 2) {
                if (h == 0) {
                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                }
                h++;
                return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                    .appendTo(ul);
            }
        };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //}
    //else {
    //    runError("Please select company");
    //}
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })
}

function DataloadMasterBoard(sApiName,TagName, surl, sTagNameGroup, iTypeTagId, iMaster, sTagNameBoardCode) {
    //Based on Group ,Type boarname and boardcode get loaded.
    //sTagNameGroup-> Group tagname
    //iTypeTagId-> Type tag id
    //iMaster -> 1 -> Account
    //iMaster -> 2 -> Product
    //sTagNameBoardCode -> boardcode tagname
  //  alert("DataloadMasterBoard" + sApiName)
   // alert("iTypeTagId"+$(iTypeTagId).val());
   // if (($("#CompanySelect").val()) != "") {
        $(TagName).autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: surl,
                    data: { apiName: sApiName, sFParameter: "sGroup", sFParameterValue: $(sTagNameGroup).val(), sSParameter: "iType", sSParameterValue: $(iTypeTagId).val(), sTParameter: "iMaster", sTParameterValue: iMaster, sSearch: request.term },
                  /*  data: { company: parseInt($("#CompanySelect-id").val()), search: request.term, type: SearchTypeAuto },*/
                    success: function (data, res) {
                        h = 0; if (data!="Error") {
                            response($.map(data, function (item) {

                                return { sName: item.sBName, sCode: item.sBCode};
                            }))
                        }
                        else {
                            alert("No Data");
                        }
                    },
                    error: function (response) {
                        ////alert(response.responseText);
                        alert("No Data");
                    },
                    failure: function (response) {
                        //alert(response.responseText);
                        alert("No Data");


                    }
                })
            },
            delay: 0,
            autoFocus: true,
            minLength: false,
            focus: function (event, ui) {
                if (ui.item != undefined) {
                    if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
                        event.preventDefault();

                    }
                    else {
                        event.preventDefault();
                        //$(TagName).val("");
                        //$(TagName + "-id").val(0);
                        //$(TagName + "-code").val("");

                        //   $(TagName ).val(ui.item.sName);
                    }
                }
                return false;
            },
            select: function (event, ui) {
                if (ui.item != undefined) {
                    if (ui.item.sName != "No Data") {

                        //alert(ui.item.sName)
                        $(TagName).val(ui.item.sName);
                       // $(TagName + "-id").val(ui.item.iId).trigger('change');
                        $(sTagNameBoardCode).val(ui.item.sCode);
                    }
                    else {
                        $(TagName).val("");
                        //$(TagName + "-id").val(0);
                        $(sTagNameBoardCode).val("");

                    }
                }
                return false;
            }


        })

            .data("autocomplete")._renderItem = function (ul, item) {

                $("[role=listbox]").css("overflow", "auto");
                $("[role=listbox]").css("max-height", "120px");
                $("[role=listbox]").css("max-width", "3050px");
                $("[role=listbox]").css("font-weight", "100");
                $("[role=listbox]").css("font-size", "smaller");
                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

                if (SearchTypeAuto == 1) {
                    if (h == 0) {
                        // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                        ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
                    }
                    h++;
                    return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                        .data("item.autocomplete", item)
                        .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
                        .appendTo(ul);
                    // console.log(JSON.stringify(item))

                }
                else if (SearchTypeAuto == 2) {
                    if (h == 0) {
                        ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
                    }
                    h++;
                    return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
                      .data("item.autocomplete", item)
                      .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
                      .appendTo(ul);
                }
            };

        //$(TagName ).mouseover(function () {
        //$(this).autocomplete("search", $(TagName ).val());
        //})
        //$(TagName).blur(function () {
        //    $(this).autocomplete("search", $(TagName).val());
        //})
        //$(TagName).focus(function () {
        //    $(this).autocomplete("search", $(TagName).val());
        //})
        //$(TagName).mouseup(function () {
        //    $(this).autocomplete("search", $(TagName).val());
        //})
    //}
    //else {
    //    runError("Please select company");
    //}
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })
}

//function DataloadMasterBank(TagName, surl) {
//    if (($("#CompanySelect").val()) == "") {
//        runError("Please select company");
//    }
//    else if (($("#BeneficiarySelect").val()) == "") {
//        runError("Please Select Benificiary");
//    }else {
//        $(TagName).autocomplete({
//            source: function (request, response) {
//                $.ajax({
//                    url: surl,
//                    data: { company: parseInt($("#CompanySelect-id").val()), search: request.term, type: SearchTypeAuto, Beneficiary: parseInt($("#VendorSelect-id").val()) },
//                    success: function (data, res) {
//                        h = 0; if (data != "Error") {
//                            response($.map(data, function (item) {
//                                return { sName: item.sName, sCode: item.sCode, iId: item.iId, BankAc: item.BankAcNo, BankSWIFT: item.BankSWIFT, BankCountry: item.BankCountry, BankIBAN: item.BankIBAN, BankAddress: item.BankAddress };
//                            }))
//                        }
//                        else {
//                            alert("No Data");
//                        }
//                    },
//                    error: function (response) {
//                        ////alert(response.responseText);
//                        alert("No Data");
//                    },
//                    failure: function (response) {
//                        //alert(response.responseText);
//                        alert("No Data");
//                    }
//                })
//            },
//            delay: 0,
//            autoFocus: true,
//            minLength: false,
//            focus: function (event, ui) {
//                if (ui.item != undefined) {
//                    if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
//                        event.preventDefault();

//                    }
//                    else {
//                        event.preventDefault();
//                        //$(TagName).val("");
//                        //$(TagName + "-id").val(0);
//                        //$(TagName + "-code").val("");
//                        //$(TagName).val(ui.item.sName);
//                    }
//                }
//                return false;
//            },
//            select: function (event, ui) {
//                if (ui.item != undefined) {
//                    if (ui.item.sName != "No Data") {
//                        $(TagName).val(ui.item.sName);
//                        $(TagName + "-id").val(ui.item.iId).trigger('change');
//                        $(TagName + "-code").val(ui.item.sCode);
                       
//                        if (TagName == "#BanksSelect")
//                        {
//                            //$("FocusBanksSelect-id").val(ui.item.iId);
//                            //$("FocusBanksSelect").val(ui.item.sName);
//                            $("#sBankAccount").val(ui.item.BankAc);
//                            $("#sBankSWIFT").val(ui.item.BankSWIFT);
//                            $("#sBankAddress").val(ui.item.BankAddress);
//                            $("#sBankIBAN").val(ui.item.BankIBAN);
//                            $("#sBankCountry").val(ui.item.BankCountry);
//                        }
//                    }
//                    else {
//                        $(TagName).val("");
//                        $(TagName + "-id").val(0);
//                        $(TagName + "-code").val("");
//                        if (TagName == "#BanksSelect") {
//                            //$("FocusBanksSelect-id").val("");
//                            //$("FocusBanksSelect").val("");
//                            $("sBankAccount").val("");
//                            $("sBankSWIFT").val("");
//                            $("#sBankAddress").val("");
//                            $("#sBankIBAN").val("");
//                            $("#sBankCountry").val("");
//                        }
//                    }
//                }
//                return false;
//            }
//        })
//            .data("autocomplete")._renderItem = function (ul, item) {

//                $("[role=listbox]").css("overflow", "auto");
//                $("[role=listbox]").css("max-height", "120px");
//                $("[role=listbox]").css("max-width", "250px");
//                $("[role=listbox]").css("font-weight", "100");
//                $("[role=listbox]").css("font-size", "smaller");
//                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
//                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

//                if (SearchTypeAuto == 1) {
//                    if (h == 0) {
//                        // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
//                        ul.prepend("<li class=header-auto row style=background-color:gray;><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'></a></li>")
//                    }
//                    h++;
//                    return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
//                        .data("item.autocomplete", item)
//                        .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
//                        .appendTo(ul);
//                    // console.log(JSON.stringify(item))

//                }
//                else if (SearchTypeAuto == 2) {
//                    if (h == 0) {
//                        ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
//                    }
//                    h++;
//                    return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
//                      .data("item.autocomplete", item)
//                      .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
//                      .appendTo(ul);
//                }
//            };
//        //$(TagName ).mouseover(function () {
//        //$(this).autocomplete("search", $(TagName ).val());
//        //})
//        //$(TagName).blur(function () {
//        //    $(this).autocomplete("search", $(TagName).val());
//        //})
//        //$(TagName).focus(function () {
//        //    $(this).autocomplete("search", $(TagName).val());
//        //})
//        //$(TagName).mouseup(function () {
//        //    $(this).autocomplete("search", $(TagName).val());
//        //})
//    }
//    $(TagName).click(function () {
//        $(this).autocomplete("search", $(TagName).val());

//    })
//}
//function DataloadMaster_Id(mid, TagName, surl, TagName1) {
//    $(TagName).autocomplete({
//        source: function (request, response) {
//            $.ajax({
//                url: surl,
//                data: { search: request.term, type: SearchTypeAuto, mid: mid, Id: parseInt($(TagName1).val()) },
//                success: function (data, res) {
//                    h = 0;
//                    response($.map(data, function (item) {
//                        return { sName: item.sName, sCode: item.sCode, iId: item.iId, iStatus: item.iStatus };
//                    }))
//                },
//                error: function (response) {
//                    alert(response.responseText);
//                },
//                failure: function (response) {
//                    alert(response.responseText);
//                }
//            })
//        },
//        delay: 0,
//        autoFocus: true,
//        minLength: false,
//        focus: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
//                    //  $(TagName ).val("");
//                    event.preventDefault();

//                }
//                else {
//                    event.preventDefault();
//                    $(TagName).val("");
//                    $(TagName + "-id").val(0);
//                }
//            }
//            return false;
//        },
//        select: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.sName != "No Data") {


//                    $(TagName).val(ui.item.sName);
//                    $(TagName + "-id").val(ui.item.iId);
//                    $(TagName + "-id").val(ui.item.iId).trigger('change');
//                    $("#txtiStatus").val(ui.item.iStatus);

//                }
//                else {
//                    $(TagName).val("");
//                    $(TagName + "-id").val(0);
//                    $("#txtiStatus").val(0);

//                }
//            }
//            return false;
//        }


//    })

//            .data("autocomplete")._renderItem = function (ul, item) {

//                $("[role=listbox]").css("overflow-y", "auto");
//                $("[role=listbox]").css("max-height", "120px");
//                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
//                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

//                if (SearchTypeAuto == 1) {
//                    if (h == 0) {
//                        // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
//                        ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Name<span style='float:right;'>Code</a></li>")
//                    }
//                    h++;
//                    return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
//                        .data("item.autocomplete", item)
//                        .append("<a class='col-lg-12'><span>" + item.sName + "</span><span style='float:right;'>" + item.sCode + "</a>")
//                        .appendTo(ul);
//                    // console.log(JSON.stringify(item))

//                }
//                else if (SearchTypeAuto == 2) {
//                    if (h == 0) {
//                        ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Code<span style='float:right;'>Name</a></li>")
//                    }
//                    h++;
//                    return $("<li class=row style=background-color:rgba(255, 255, 128, .5)>")
//                      .data("item.autocomplete", item)
//                      .append("<a class='col-lg-12'><span>" + item.sCode + "</span><span style='float:right;'>" + item.sName + "</a>")
//                      .appendTo(ul);
//                }
//            };

//    $(TagName).click(function () {
//        $(this).autocomplete("search", $(TagName).val());

//    })

//}


//function DataloadMaster_dropdown1(TagName, surl) {
//    $(TagName).autocomplete({
//        source: function (request, response) {
//            $.ajax({
//                url: surl,
//                data: { search: request.term },
//                success: function (data, res) {
//                    h = 0;
//                    response($.map(data, function (item) {

//                        return { Name: item.Name };
//                    }))
//                },
//                error: function (response) {
//                    alert(response.responseText);
//                },
//                failure: function (response) {
//                    alert(response.responseText);

//                }
//            })
//        },
//        delay: 0,
//        autoFocus: true,
//        minLength: false,
//        focus: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.Name == "No Data") {
//                    //  $(TagName ).val("");
//                    event.preventDefault();

//                }
//                else {
//                    event.preventDefault();
//                    $(TagName).val("");
//                }
//            }
//            return false;
//        },
//        select: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.Name != "No Data") {


//                    $(TagName).val(ui.item.Name);

//                }
//                else {
//                    $(TagName).val("");

//                }
//            }
//            return false;
//        }


//    })

//            .data("autocomplete")._renderItem = function (ul, item) {

//                $("[role=listbox]").css("overflow-y", "auto");
//                $("[role=listbox]").css("max-height", "120px");
//                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
//                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");


//                if (h == 0) {
//                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
//                    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Name</a></li>")
//                }
//                h++;
//                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
//                    .data("item.autocomplete", item)
//                    .append("<a class='col-lg-12'><span>" + item.Name + "</span></a>")
//                    .appendTo(ul);
//                // console.log(JSON.stringify(item))

//            };

//    //$(TagName ).mouseover(function () {
//    //$(this).autocomplete("search", $(TagName ).val());
//    //})
//    //$(TagName).blur(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    //$(TagName).focus(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    //$(TagName).mouseup(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    $(TagName).click(function () {
//        $(this).autocomplete("search", $(TagName).val());

//    })

//}
//function DataloadMaster_dropdown(TagName, surl) {
//    $(TagName).autocomplete({
//        source: function (request, response) {
//            $.ajax({
//                url: surl,
//                data: { search: request.term },
//                success: function (data, res) {
//                    h = 0;
//                    response($.map(data, function (item) {

//                        return { sName: item.sName, iId: item.iId };
//                        //   return { Name: item.Name };
//                    }))
//                },
//                error: function (response) {
//                    alert(response.responseText);
//                },
//                failure: function (response) {
//                    alert(response.responseText);

//                }
//            })
//        },
//        delay: 0,
//        autoFocus: true,
//        minLength: false,
//        focus: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.sName == "No Data") {
//                    event.preventDefault();

//                }
//                else {
//                    event.preventDefault();
//                    //$(TagName).val("");
//                    //$(TagName + "-id").val(0);
//                    //$(TagName + "-code").val("");

//                    //   $(TagName ).val(ui.item.sName);
//                }
//            }
//            return false;
//        },
//        select: function (event, ui) {
//            if (ui.item != undefined) {
//                if (ui.item.sName != "No Data") {


//                    $(TagName).val(ui.item.sName);
//                    $(TagName + "-id").val(ui.item.iId).trigger('change');
//                   // $(TagName + "-code").val(ui.item.Code2);
//                }
//                else {
//                    $(TagName).val("");
//                    $(TagName + "-id").val(0);
//                   // $(TagName + "-code").val("");

//                }
//            }
//            return false;
//        }


//    })

//            .data("autocomplete")._renderItem = function (ul, item) {

//                $("[role=listbox]").css("overflow", "auto");
//                $("[role=listbox]").css("max-height", "120px");
//                $("[role=listbox]").css("max-width", "250px");
//                $("[role=listbox]").css("font-weight", "100");
//                $("[role=listbox]").css("font-size", "smaller");
//                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
//                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

//                if (h == 0) {
//                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
//                    ul.prepend("<li class=header-auto row style=background-color:gray;></a></li>")
//                }
//                h++;
//                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
//                    .data("item.autocomplete", item)
//                    .append("<a class='col-lg-12'><span>" + item.sName + "</span></a>")
//                    .appendTo(ul);
//                // console.log(JSON.stringify(item))



//            };

//    //$(TagName ).mouseover(function () {
//    //$(this).autocomplete("search", $(TagName ).val());
//    //})
//    //$(TagName).blur(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    //$(TagName).focus(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    //$(TagName).mouseup(function () {
//    //    $(this).autocomplete("search", $(TagName).val());
//    //})
//    $(TagName).click(function () {
//        $(this).autocomplete("search", $(TagName).val());

//    })

//}



/////////////////////Checkbox
function Checkbox_dropdown(TagName, surl) {
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: surl,
                data: { search: request.term },
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, iId: item.iId };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        //focus: function (event, ui) {
        //    if (ui.item != undefined) {
        //        if (ui.item.sName == "No Data" || ui.item.sCode == "No Data") {
        //            //  $(TagName ).val("");
        //            event.preventDefault();

        //        }
        //        else {
        //            event.preventDefault();
        //            $(TagName).val("");
        //            $(TagName + "-id").val(0);
        //        }
        //    }
        //    return false;
        //},
        //select: function (event, ui) {
        //    if (ui.item != undefined) {
        //        if (ui.item.sName != "No Data") {


        //            $(TagName).val(ui.item.sName);
        //            $(TagName + "-id").val(ui.item.iId);
        //            $(TagName + "-id").val(ui.item.iId).trigger('change');
        //        }
        //        else {
        //            $(TagName).val("");
        //            $(TagName + "-id").val(0);

        //        }
        //    }
        //    return false;
        //}


    })

            .data("autocomplete")._renderItem = function (ul, item) {

                $("[role=listbox]").css("overflow-y", "auto");
                $("[role=listbox]").css("max-height", "120px");


                //if (h == 0) {
                //    ul.prepend("<li class=header-auto row style=background-color:gray><span style=background-color:gray class='col-lg-12'>Name</a></li>")
                //}
                //h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><input type='Checkbox' id=" + item.iId + "><span>" + item.sName + "</span></a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))

            };

    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}


function Dropdown_SingleExc(TagName, surl) {
    $(TagName).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: surl,
                data: { search: request.term },
                success: function (data, res) {
                    h = 0;
                    response($.map(data, function (item) {

                        return { sName: item.sName, iId: item.iId, fExcRate: item.fExcRate };
                        //   return { Name: item.Name };
                    }))
                },
                error: function (response) {
                    alert(response.responseText);
                },
                failure: function (response) {
                    alert(response.responseText);

                }
            })
        },
        delay: 0,
        autoFocus: true,
        minLength: false,
        focus: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName == "No Data") {
                    event.preventDefault();

                }
                else {
                    event.preventDefault();
                    //$(TagName).val("");
                    //$(TagName + "-id").val(0);
                    //$(TagName + "-code").val("");

                    //   $(TagName ).val(ui.item.sName);
                }
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item != undefined) {
                if (ui.item.sName != "No Data") {


                    $(TagName).val(ui.item.sName);
                    $(TagName + "-id").val(ui.item.iId).trigger('change');
                    $(TagName + "-Rate").val(ui.item.fExcRate)
                   // $(TagName + "-code").val(ui.item.Code2);
                }
                else {
                    $(TagName).val("");
                    $(TagName + "-id").val(0);
                    $(TagName + "-Rate").val(1)
                    // $(TagName + "-code").val("");

                }
            }
            return false;
        }


    })

            .data("autocomplete")._renderItem = function (ul, item) {

                $("[role=listbox]").css("overflow", "auto");
                $("[role=listbox]").css("max-height", "120px");
                $("[role=listbox]").css("max-width", "250px");
                $("[role=listbox]").css("font-weight", "100");
                $("[role=listbox]").css("font-size", "smaller");
                //  $("[role=listbox]").css("background-color", "rgba(255, 255, 128, .5)");
                // $("[role=menuitem]").css("background-color", "rgba(255, 255, 128, .5)");

                if (h == 0) {
                    // ul.prepend("<li class=header-auto row style=background-color:gray><span class=col-6>Name</span><span class=col-6>Code</span></li>")
                    ul.prepend("<li class=header-auto row style=background-color:gray;></a></li>")
                }
                h++;
                return $("<li class=row  style=background-color:rgba(255, 255, 128, .5)></li>")
                    .data("item.autocomplete", item)
                    .append("<a class='col-lg-12'><span>" + item.sName + "</span></a>")
                    .appendTo(ul);
                // console.log(JSON.stringify(item))



            };

    //$(TagName ).mouseover(function () {
    //$(this).autocomplete("search", $(TagName ).val());
    //})
    //$(TagName).blur(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).focus(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    //$(TagName).mouseup(function () {
    //    $(this).autocomplete("search", $(TagName).val());
    //})
    $(TagName).click(function () {
        $(this).autocomplete("search", $(TagName).val());

    })

}

