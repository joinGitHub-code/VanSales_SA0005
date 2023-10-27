


var _BillWiseReferenceEdit = [];
var AttachmentPostList = [];
var mainTableList = [];
var referenceData = [];//for storing popup refernce values from api //batchdata
var referenceData_load = []; //batchdata_load
var batchCreatedFlg = 0;
var userid = $("#hdn_SessionUID").val();
var iVoucherType = $("#hdn_iVoucherType").val();
var sAccountBType = $("#hdn_AccountBType").val();//account in grid
var fDecFix = 4;
var fDecFixAmount = 4;
var type = 1;
var _flagPrint = 0;

//loadReceipt(type);
getMainSetting();
document.getElementById("MenuBtns").children[3].style.display = "none";
document.getElementById("MenuBtns").children[4].style.display = "none";

function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    // alert(d);
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    //return [year, month, day].join('-');
    return [day, month, year].join('-');
}

var date = formatDate();
$('#tdate').val(date);

function ConvertDate(date) {
    //alert(date)
    var d = date.split('-');
    var day = d[0];
    var month = d[1];
    var year = d[2];
    return [year, month, day].join('-');
    //return [day, month, year].join('-');
}
function enableMainTab() {
    $("ul.nav.nav-tabs li a").removeClass("active");
    $("ul.nav.nav-tabs li:first a").addClass("active");
    $(".tab-content .tab-pane").removeClass("active");
    $(".tab-content .tab-pane.in:first").addClass("active");
}
function newMode() {
    //$.ajax({
    //    url: '/FocusMaxTransaction/ClearUploads',
    //    method: 'get',
    //    success: function (data) { }

    //});
    $("#btnPost").prop("disabled", false);
    $("#btnPostPrint").prop("disabled", false);

    //$("#Company").prop("disabled", false);
    //$("#iCurrency").prop('disabled', false);
    //$("#fExchangeRate").prop('disabled', false);
    //document.getElementById("MenuBtns").children[4].style.display = "none"; //btnPrint hide
    type = 1;
    $("#hdn_iTransID").val(0);
    //$.ajax({
    //    url: '/FocusMaxTransaction/GetTop_DocNo?iDoctype=' + iVoucherType,
    //    method: 'get',
    //    //  data: { ReceiptDetails: PostReceipt },
    //    success: function (data) {
    //        data = JSON.parse(data);
    //        data = data.ResultData;
    //        // alert("1."+data)
    //        data = JSON.parse(data);
    //        //alert("btnNew data" + data)
    //        $("#tdoc_no").val(data);           

    //    }
    //});

    $('#tdate').val(date);
   // clearHeaderFields();
    DisplayTransaction();
   // enableMainTab();
}




$("#btnNew").on('click', function () {
    //alert(userid)
    if (userid == 0) {
        window.location = "/Main/LogOut";
    }
    else {
        newMode();
    }
});


function clearHeaderFields() {
   
    $("#Company").val("");
    $("#Company-id").val(0);
    $("#Bank").val("");
    $("#Bank-id").val(0);

    $("#tCheqDate").val("");
    $("#tCheqNo").val("");
    $("#tbillno").val("");
    $("#Jurisdiction").val("");
    $("#Jurisdiction-id").val(0);
    $("#PlaceOfSupply").val("");
    $("#PlaceOfSupply-id").val(0);

    $("#InterCo").val("");
    $("#InterCo-id").val(0);
    $("#iCurrency").val("");
    $("#iCurrency-id").val(0);
    $("#fExchangeRate").val("");
    $("#tNarration").val("");
}

//function clearScreen() {
//    alert("Com" + $("#Company").val());
//    if (($("#hdn_iTransID").val() == "") || ($("#hdn_iTransID").val() == 0)) {
//        //alert("len" + document.getElementById("receiptTransactionTableBody").rows.length);
//        if (document.getElementById("receiptTransactionTableBody").rows.length > 1) {
//            $("label[for='msgClearscreen']").text("Do you want to clear Document");
//            $("#modal-ClearScreenConfirm").show();
//        }
//        else if (($("#PlaceOfSupply-id").val() != 0) || ($("#Jurisdiction-id").val() != 0) || ($("#InterCo-id").val() != 0) || ($("#iCurrency-id").val() != 0)) {
//            $("label[for='msgClearscreen']").text("Do you want to clear Headers");
//            $("#modal-ClearScreenConfirm").show();
//        }
        
//    }
//    //else {
//    //    runError("Cannot Change Company");

//    //}
//}

//$("#btnClearscreenyes").click(function () {
//    $("#modal-ClearScreenConfirm").hide();
//    if (document.getElementById("receiptTransactionTableBody").rows.length > 1) {
//        clearHeaderFields();
//        DisplayTransaction();
//    }

    
//});

//$("#btnClearscreenno").click(function () {
//    $("#modal-ClearScreenConfirm").hide();
//})
//$("#btncloseClearscreen").click(function () {
//    $("#modal-ClearScreenConfirm").hide();

//})





function getBaseCurrency() {
    if (userid == 0) {
        window.location = "/Main/LogOut";
    }
    else {
        var iCompany = $("#Company-id").val();
        $.ajax({
            url: '/FocusMaxTransaction/GetBaseCurrency?sApiName=GetBaseCurrency&sParamOne=iCompany&sParamOneVal=' + iCompany,
            method: 'get',
            //  data: { ReceiptDetails: PostReceipt },
            success: function (data) {
                data = JSON.parse(data);
                data = data.ResultData;
                //alert("1."+data)
                data = JSON.parse(data);
                //alert("btnNew data" + data)
                $("#iCurrency").val(data[0].sName);
                $("#iCurrency-id").val(data[0].iId);
                $("#fExchangeRate").val(data[0].fExcRate.toFixed(data[0].sDecimal));
                fDecFix = data[0].sDecimal;

            }
        });
    }
}



$('#btnPost').on('click', function () {

    _flagPrint = 0;
    setPriorPost(_flagPrint);

});
$('#btnPostPrint').on('click', function () {
    $("#LayoutSelect").val("");
    $("#LayoutSelect-id").val(0);
    _flagPrint = 1;
    setPriorPost(_flagPrint);
});

function setPriorPost(flagPrint) {

    var table = document.getElementById("receiptTransactionTableBody");
    var rows = table.getElementsByTagName("tr");
    var len = rows.length;
    // alert("len" + len)
    if (len == 1) {
        runError("Need atleast one row");
    }

    else if ($("#tdoc_no").val() == "") {
        runError("Doc No is required");
    }
    else if ($("#tdate").val() == "") {
        runError("Select Date");
    }
    else if ($("#Company").val() == "" || $("#Company-id").val() == 0) {
        runError("Select Company");
    }
    else if ($("#Bank").val() == "" || $("#Bank-id").val() == 0) {
        runError("Select Cash/Bank");
    }
    //else if ($("#InterCo").val() == "" || $("#InterCo-id").val() == 0) {
    //    runError("Select InterCo");
    //}
    //else if ($("#InterCo").val() == "" || $("#InterCo-id").val() == 0) {
    //    runError("Select InterCo");
    //}
    else if ($("#iCurrency").val() == "" || $("#iCurrency-id").val() == "0") {
        runError("Select Currency");
    }
    else if ($("#fExchangeRate").val() == "" || $("#fExchangeRate").val() == 0) {
        runError("Currency Conv. is required");
    }
    else {        
        setPost(flagPrint);    

    }
}
function setPost(flagPrint) {
    //alert("setPost")
    var _referenceData_JsonList = [];
    var _referenceData_load = [];

    var errorMsgBody = "  Please fill required fields in row";
    var errorMsgAccountBody = "Cash/Bank and Account cannot be same in row";
    var errorMsgNQty = "Amount and Reference Mismatch in row";
    var mandatoryBodyFlag = 1;

    var i = 0;
    var json = [];
    //var headerList = [];
    var headerJson = {};
    headerJson["iTransId"] = $("#hdn_iTransID").val();
    headerJson["sDocNo"] = $("#tdoc_no").val();
    headerJson["iDocDate"] = ConvertDate($("#tdate").val());
    headerJson["iAccount1"] = $("#Bank-id").val();
    headerJson["sNarration"] = $("#tNarration").val();
    if ($("#tCheqDate").val() == "") {
        headerJson["iChqDate"] = "";
    }
    else {
        headerJson["iChqDate"] = ConvertDate($("#tCheqDate").val());
    }
    headerJson["sChqNo"] = $("#tCheqNo").val();
    headerJson["sBillNo"] = $("#tbillno").val();
    headerJson["iJur"] = $("#Jurisdiction-id").val();
    headerJson["iPOS"] = $("#PlaceOfSupply-id").val();
    headerJson["iInterCo"] = $("#InterCo-id").val();
    headerJson["iCurrency"] = $("#iCurrency-id").val();
    headerJson["fExchRate"] = $("#fExchangeRate").val();   
    headerJson["iUser"] = $("#hdn_SessionUID").val();
    headerJson["iCompany"] = $("#Company-id").val();


    
    $("#btnPost").prop("disabled", true);
    $("#btnPostPrint").prop("disabled", true);
    //alert("Im here")
    $('#receiptTransactionTableBody tr:not(:last)').each(function (index, tr) {
        var iRowID = $(this).attr('id');
        i = parseInt(iRowID);
       // alert("_rowID" + iRowID)
       // alert("iTag1" + $("#iTag1_" + iRowID).val());
       // alert("iTag1 id" + $("#iTag1_" + iRowID + "-id").val());
       // alert("iTag2" + $("#iTag2_" + iRowID).val());
      //  alert("iTag2 id " + $("#iTag2_" + iRowID + "-id").val());
        if ($("#iTag1_" + iRowID).val() == "" || (parseInt($("#iTag1_" + iRowID + "-id").val()) == 0) || $("#iTag1_" + iRowID + "-id").val() == "") { //Trade No
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";

        }
        if ($("#iTag2_" + iRowID).val() == "" || (parseInt($("#iTag2_" + iRowID + "-id").val()) == 0) || $("#iTag2_" + iRowID + "-id").val() == "") {//Division
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";

        } if ($("#iTag4_" + iRowID).val() == "" || (parseInt($("#iTag4_" + iRowID + "-id").val()) == 0) || $("#iTag4_" + iRowID + "-id").val() == "") {//CostCentre
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        } if ($("#iTag5_" + iRowID).val() == "" || (parseInt($("#iTag5_" + iRowID + "-id").val()) == 0) || $("#iTag5_" + iRowID + "-id").val() == "") {//Project
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }
        if ($("#iTag6_" + iRowID).val() == "" || (parseInt($("#iTag6_" + iRowID + "-id").val()) == 0) || $("#iTag6_" + iRowID + "-id").val() == "") {//BusinessUnit
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }
        if ($("#iTag7_" + iRowID).val() == "" || (parseInt($("#iTag7_" + iRowID + "-id").val()) == 0) || $("#iTag7_" + iRowID + "-id").val() == "") {//Location
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }
        if ($("#iTag8_" + iRowID).val() == "" || (parseInt($("#iTag8_" + iRowID + "-id").val()) == 0) || $("#iTag8_" + iRowID + "-id").val() == "") {//SubTrade
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }

        if ($("#CreditAccount_" + iRowID).val() == "" || (parseInt($("#CreditAccount_" + iRowID + "-id").val()) == 0) ||$("#CreditAccount_" + iRowID + "-id").val() == "") {//CreditAmount
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }

        if ($("#Amount_" + iRowID).val() == "" || (parseFloat($("#Amount_" + iRowID).val()) <= 0)) {//SubTrade
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            
            if ((errorMsgBody.indexOf(substring) == -1))
                errorMsgBody += " " + (index + 1) + " ,";
        }

        //Checking header and Grid accounts
        if (($("#Bank-id").val() == $("#CreditAccount_" + iRowID + "-id").val())) {
            var substring = index + 1;
            mandatoryBodyFlag = 0;
            if ((errorMsgAccountBody.indexOf(substring) == -1))
                errorMsgAccountBody += " " + (index + 1) + " ,";
        }

         ////Reference
       
        var totReferencePopUpQty = 0;
        if (!($("#Reference_" + iRowID).prop('disabled'))) {
            var _referenceData_loadPost = referenceData_load.filter(x => (x.iRow == iRowID));//for checking qty and batch tot qty mismatch....
            if (_referenceData_loadPost.length > 0) {
                for (var j = 0; j < _referenceData_loadPost.length; j++) {
                    if ((_referenceData_loadPost[j].fQty != NaN)) {
                        totReferencePopUpQty += parseFloat(_referenceData_loadPost[j].fQty);
                        totReferencePopUpQty;
                    }
                }
            }
            var fQty_ = applyExchngRateToAmt(iRowID);
            if (fQty_ == NaN || fQty_ == "") {
                fQty_ = 0;
            }
            //else {
            //    fQty_ = parseFloat($("#Amount_" + iRowID).val())
            //}
            //alert("totReferencePopUpQty " + totReferencePopUpQty)
           // alert("fQty_ " + fQty_)
            totReferencePopUpQty = totReferencePopUpQty; //.toFixed(fDecFix);
            if (totReferencePopUpQty != fQty_) {
                mandatoryBodyFlag = 0;
                errorMsgNQty += " " + (index + 1) + " ,";
            }

        }

       

        //if ($("#TaxCode_" + iRowID).val() == "" || (parseInt($("#TaxCode_" + iRowID).val()) == 0)) {//TaxCode
        //    var substring = index + 1;
        //    mandatoryBodyFlag = 0;
        //    if ((errorMsgBody.indexOf(substring) == -1))
        //        errorMsgBody += " " + (index + 1) + " ,";
        //}
        //if ($("#Vat_" + iRowID).val() == "" || (parseInt($("#Vat_" + iRowID).val()) == 0)) {//Vat
        //    var substring = index + 1;
        //    mandatoryBodyFlag = 0;
        //    if ((errorMsgBody.indexOf(substring) == -1))
        //        errorMsgBody += " " + (index + 1) + " ,";
        //}

        //if ($("#RelatedParty_" + iRowID).val() == "" || (parseInt($("#RelatedParty_" + iRowID + "-id").val()) == 0)) {//RelatedParty
        //    var substring = index + 1;
        //    mandatoryBodyFlag = 0;
        //    if ((errorMsgBody.indexOf(substring) == -1))
        //        errorMsgBody += " " + (index + 1) + " ,";
        //}
       
        //alert("SETPOST mandatoryBodyFlag:" + mandatoryBodyFlag);
        if (mandatoryBodyFlag == 1)
        {
           
            var sTradeNo = $("#iTag1_" + i).val();
            var iTradeNoId = $("#iTag1_" + i + "-id").val();
            var sDivision = $("#iTag2_" + i).val();
            var iDivisionId = $("#iTag2_" + i + "-id").val();
            var sCostCentre = $("#iTag4_" + i).val();
            var iCostCentreId = $("#iTag4_" + i + "-id").val();
            var sProject = $("#iTag5_" + i).val();
            var iProjectId = $("#iTag5_" + i + "-id").val();
            var sBusinessUnit = $("#iTag6_" + i).val();
            var iBusinessUnitId = $("#iTag6_" + i + "-id").val();
            var sLocation = $("#iTag7_" + i).val();
            var iLocationId = $("#iTag7_" + i + "-id").val();
            var sSubTrade = $("#iTag8_" + i).val();
            var iSubTradeId = $("#iTag8_" + i + "-id").val();
            var sCreditAccount = $("#CreditAccount_" + i).val();
            var iCreditAccountId = $("#CreditAccount_" + i + "-id").val();
            var fAmount = $("#Amount_" + i).val();  
            var sRemarks = $("#Remarks_" + i).val();        
            var iTaxCode = $("#TaxCode_" + i+"-id").val();
            var fVat = $("#Vat_" + i).val();           
            var iRelatedPartyId = $("#RelatedParty_" + i + "-id").val();            
            var bodyList = {};
            bodyList["iSiNo"]= i + 1;
            bodyList["iAccount2"]= iCreditAccountId;
            bodyList["iTag1"] = iTradeNoId;
            bodyList["iTag2"] = iDivisionId;
            bodyList["iTag3"] = 0;
            bodyList["iTag4"] = iCostCentreId;
            bodyList["iTag5"] = iProjectId;
            bodyList["iTag6"] =iBusinessUnitId;
            bodyList["iTag7"] = iLocationId;
            bodyList["iTag8"] = iSubTradeId,
            bodyList["fAmount"] = fAmount;
            bodyList["sRemarks"] = sRemarks;
            bodyList["iTaxCode"] = iTaxCode;
            bodyList["fVat"] = fVat;
            bodyList["iRelParty"] = iRelatedPartyId;
            
            json.push(bodyList);

            //alert("json" + JSON.stringify(json));
            //BWR
            if (referenceData_load.length > 0) {
                _referenceData_load = referenceData_load.filter(x => (x.iRow == i)).map(function (obj) {
                    return {
                        "iSiNo": i + 1,
                        "sDocNo": obj.sDocNo,
                        "iRef": obj.iRef,
                        "fAmount":parseFloat(obj.fQty),
                        "iRefType": obj.iRefType,
                        "iDocType": iVoucherType
                    }
                });
                _referenceData_JsonList = $.merge(_referenceData_JsonList, _referenceData_load);
                //alert("_referenceData_JsonList" + JSON.stringify(_referenceData_JsonList))
            }

    }//end of if (mandatoryBodyFlag == 1)        

       
        

    });
    if ((mandatoryBodyFlag == 1)) {

        var sAttachmentTblLength = $('#tbltransAttachbody tr').length;
        AttachmentPostList = [];
        if (sAttachmentTblLength > 0) {
           
            $('#tbltransAttachbody  tr').each(function (index, tr) {
                //var i = index;
                //var iSiNo = $("#iSiNo" + i).text();
                // var iDocType = $("#iDocType" + i).val();
                // var sRefNo = $("#refNo" + i).text();
                var sFileName = $("#fileName" + index).val();
                //var k = { "iSiNo": iSiNo, "iAttachType": iDocType, "sRefNo": sRefNo, "sPath": sFileName };
                //var k = { "iSiNo": iSiNo, "sPath": sFileName };
                var k = {"sFileName": sFileName };
                // alert("heree" + JSON.stringify(k));
                AttachmentPostList.push(k);
            });

        }

       




        if (json.length == 0) {
            $("#btnPost").prop("disabled", false);
            $("#btnPostPrint").prop("disabled", false);
            runError("Invalid Data");
        }
        else {
            //alert("headerJson" + JSON.stringify(headerJson));
            var PostReceipt = {
                "Headers": [headerJson],
                "Body": json,
                "Ref": _referenceData_JsonList,
                "Attachment": AttachmentPostList
            }
            console.log("wholePostReceipt" + JSON.stringify(PostReceipt));
            //var PostReceipt_string = JSON.stringify(PostReceipt);

            $.ajax({
                url: '/FocusMaxTransaction/PostReceipt',
                method: 'post',
                data: { ReceiptDetails: PostReceipt, sApiName: "PostReceipt" },
                //url: 'http://185.151.4.167/SangHRMS/Max/PostTransaction',               
                //data: { PostDynamic},
                success: function (data) {
                    //alert("OK" + data)

                    var msgResponse = data.response;
                    var trial = JSON.stringify(data.record)
                    if (trial == "{}") {
                        runError(msgResponse);
                    }
                    else if (data != -1) {//success
                        
                       // if (type == 1) {
                            if (msgResponse == "Inserted successfully" || msgResponse == "Updated successfully") {
                                runsuccess1(msgResponse);
                                var iTransID_Resp = JSON.stringify(data.record.table[0].iTransId)
                                var sDocNo_Resp = JSON.stringify(data.record.table[0].sDocNo);
                                console.log("SAVED iTransId" + iTransID_Resp);
                                console.log("SAVED sDocNo" + sDocNo_Resp);
                                newMode();
                                if (flagPrint == 1) {
                                    $("#btnPrint").prop("disabled", false);
                                    $("#hdn_iTransID").val(iTransID_Resp);
                                    $("#TransPrintModal").show();
                                   
                                }
                                
                            }
                            else {
                                runError("Something went wrong");
                            }
                        //}
                        //else if (type == 2) {
                        //    if (msgResponse == "Updated successfully") {
                        //        runsuccess1(msgResponse);
                        //        var iTransID_Resp = JSON.stringify(data.record.table[0].iTransId)
                        //        var sDocNo_Resp = JSON.stringify(data.record.table[0].sDocNo);
                        //        console.log("SAVED iTransId" + iTransID_Resp);
                        //        console.log("SAVED sDocNo" + sDocNo_Resp);
                        //        newMode();
                        //    }
                        //    else {
                        //        runError("Something went wrong");
                        //    }
                        //}                                           
                       
                        $("#btnPost").prop("disabled", false);
                        $("#btnPostPrint").prop("disabled", false);
                       // $("#hdn_iTransID").val();
                       
                    }
                    else {
                        runError("Invalid Voucher");
                    }



                }
            });
           
        }//else of json.length == 0

    }
    else if (errorMsgBody.includes(",")) {
            $("#btnPost").prop("disabled", false);
            $("#btnPostPrint").prop("disabled", false);
            errorMsgBody = errorMsgBody.trimRight();
            errorMsgBody = errorMsgBody.slice(0, - 1);
            runError("" + errorMsgBody);
    }
    else if (errorMsgNQty.includes(",")) {
        $("#btnPost").prop("disabled", false);
        $("#btnPostPrint").prop("disabled", false);
        errorMsgNQty = errorMsgNQty.trimRight();
        errorMsgNQty = errorMsgNQty.slice(0, - 1);
        runError("" + errorMsgNQty);
    }

    else {
        $("#btnPost").prop("disabled", false);
        $("#btnPostPrint").prop("disabled", false);
        errorMsgAccountBody = errorMsgAccountBody.trimRight();
        errorMsgAccountBody = errorMsgAccountBody.slice(0, - 1);
        runError("" + errorMsgAccountBody);
    }

}

//---------------------------------------DELETE---------------------------------------//
$('#btnDelete').on('click', function () {
    
    if ($('#Summary').css('display') == 'block') { //if in summary
        if (mainTableList.length > 0) {
            // deletetype = 1;
            $("label[for='msg']").text("Do you want to Delete '" + mainTableList.length + "' Row?");
            $("#modal-DeleteSummaryConfirm").show();
        }
        else {
            runError("Please select a row");
            //$("label[for='msg']").text("Please Select Any");
            //$("#select_modal").modal('show');
        }
    }
    else {//if in new mode
        //alert("hdn_iTransID "+$("#hdn_iTransID").val());
        if (($("#hdn_iTransID").val() != "") && ($("#hdn_iTransID").val() != 0)) {
            //alert("Do you want to Delete Voucher");
            $("label[for='msg']").text("Do you want to Delete The Document");
            $("#modal-DeleteSummaryConfirm").show();

        } else {
            runError("Please select a voucher");
        }

    }
});

$("#btnsummaryyes").click(function () {
    $("#modal-DeleteSummaryConfirm").hide();
    if ($('#Summary').css('display') == 'block') { //if in summary
        deleteSummary();
    }
    else {
        deleteVoucher();
    }
});

$("#btnsummaryno").click(function () {
    $("#modal-DeleteSummaryConfirm").hide();
})
$("#btnclosesummaryde").click(function () {
    $("#modal-DeleteSummaryConfirm").hide();

})

function deleteVoucher() {
    $.ajax({
        
        url: "/FocusMaxTransaction/DeleteReceiptTransaction",
        data: { sApiName: "DeleteReceipt", iTransId: $("#hdn_iTransID").val(), iUser: $("#hdn_SessionUID").val() }, //, iDocType: $("#hdn_iVoucherType").val()
        method: 'get',
        success: function (data) {
            // alert("Voucher deleted 1." + JSON.stringify(data[0].Status) + "2." + JSON.stringify(data[0].status) + "3." + JSON.stringify(data.status))
            //clearAll();
            mainTableList = [];
            $("#hdn_iTransID").val(0);
            runsuccess1("Document Deleted");
            //setTimeout(function () { window.location = '/FocusMaxTransaction/ReceiptHome'; }, 2000);
            //setTimeout(function () { window.location = '/FocusMaxTransaction/Home?iVoucherType=' + $("#hdn_iVoucherType").val() + '&sName=' + $("#hdn_iVoucherName").val(); }, 2000);
            setTimeout(function () { DisplaySummary(); }, 2000);

        }
    });
}

function deleteSummary() {
    //alert("deleteSummary")
    var ids = '';
    var index = 0;
    $.each(mainTableList, function () {
        if (mainTableList[index].istatus == 0) {
            ids += this.iTransId + ',';
        }
        else {
            //alert("oops 1" + ids);
            runError("Cannot Delete ");
        }
        //ids += mainTableList[index] + ',';
        index++;
       // alert("ss" + JSON.stringify(mainTableList));
    });

    ids = ids.trimRight();
    ids = ids.slice(0, - 1);

     //alert("oops 2" + ids);
    // var userid = 1;
    $.ajax({
       
        url: "/FocusMaxTransaction/DeleteReceiptTransaction",
        data: { sApiName: "DeleteReceipt",iTransId: ids, iUser: $("#hdn_SessionUID").val() }, //, iDocType: $("#hdn_iVoucherType").val()
        method: 'get',
        success: function (data) {
            //alert("success" + JSON.stringify(data));
            //data.ResultData==null  //istatus=1;
            if (data == "\"Error\"") {
                runError("Cannot delete ");
                //$('#picklistsummaryTable input[type="checkbox"]').prop('checked', false);
            }
            else {

                //$('#SummaryTable').dataTable();
                //setTimeout(function () { DisplaySummary(); }, 2000);
                //window.location = '/Purchase/Home?iVoucherType=' + $("#hdn_iVoucherType").val() + '&sName=' + $("#hdn_iVoucherName").val();
                table.ajax.reload();
            }
        }
    });
    mainTableList = [];

}


$("#btnBDelete").click(function () {
    //if ($("#TableBodyData td input[type=checkBox]:checked").length >= 1) {
    //    $("label[for='msg']").text("Do you want to Delete this Row?");
    //    $("#modal-DeleteConfirm").show();
    //} else {
    //    runError("Please Select Any Checkbox")
    //}
    var flag = 0;
    var len = 0;
    $("#receiptTransactionTableBody").filter(function () {

        if ($(this).find("tr:visible").length == 1) {
            flag = 1;
            runError('cannot delete last row');
            $('#transactionTable  input[type="checkbox"]').prop('checked', false);
        }


    });
    $("#receiptTransactionTable tbody").find('input[type="checkbox"]').each(function () {

        if ($(this).is(":checked")) {
            len = len + 1;
        }
    });

    if (flag == 0) {
        if (len > 0) {
            $("label[for='msg']").text("Do you want to Delete '" + len + "' Row?");
            $("#modal-DeleteConfirm").show();
        }
        else {
            $("label[for='msg']").text("Please Select Any Checkbox");
            $("#select_modal").modal('show');
        }
    }

});
$("#btnclosede").click(function () {
    $("#modal-DeleteConfirm").hide();
});
$("#btnyes").click(function () {
    Delete_body_data()
    $("#modal-DeleteConfirm").hide();
});
$("#btnno").click(function () {
    $("#modal-DeleteConfirm").hide();
});
function Delete_body_data() {
    //$("#modal-DeleteConfirm").hide();
    //if (type == 1) 
    {
        $("#receiptTransactionTable tbody").find('input[type="checkbox"]').each(function () {
            if ($(this).is(":checked")) {
                var _rowID = $(this).attr('id');
                var id = $('#receiptTransactionTableBody tr:last').attr('id');
                //alert("_rowID" + _rowID + "id " + id);
                if (id == _rowID) {
                    runError('cannot delete last row');
                }
                else {
                    //alert("_rowID" + _rowID);
                    // var iProduct = $("#ProductSelect" + _rowID + "-id").val();
                    clearReference(_rowID);
                    //clearSerialNoSequence(_rowID)
                    $(this).parents("tr").remove();
                   
                    //btnLess();
                    // sum_Totals();





                }
            }

        });

        setFooterdata();
    }



    $('#receiptTransactionTable  input[type="checkbox"]').prop('checked', false);
    // main_Table_List = [];
    enableCompany();

}

//----------------------------------End of DELETE-------------------------------------//





function getMainSetting() {
    $.ajax({
        url: '/FocusMaxTransaction/GetMainSettings?sApiName=GetMainSetting',
        method: 'get',
        success: function (data) {

            data = JSON.parse(data);
            data = data.ResultData;

            data = JSON.parse(data);
            //alert("data" + JSON.stringify(data))//sDocNo  "iTransId

            if (data.length > 0) {

                fDecFixAmount = data[0].sDecimal;
                console.log("1. fDecFixAmount" + fDecFixAmount)
            }
        }

    });
}

function loadReceipt(itype) {

    var iTransId = $("#hdn_iTransID").val();
    console.log("iTransId" + iTransId);
    type = itype;
    if (type == 2) {
        $("#uploaddocs").prop("disabled", false);
        $.ajax({
            url: '/FocusMaxTransaction/ClearUploads',
            method: 'get',
            success: function (data) { }

        });
        document.getElementById("MenuBtns").children[4].style.display = "block";//displaying Print btn on Edit
        // updateMode = 1;
        //  _apiGet('/Sales/GetSalesDetails', { iTransId: iTransId, sApiName: "GetReceiptDetails" }).then(function (data) {
        $.ajax({
            url: '/FocusMaxTransaction/GetDetailsEdit',
            method: 'get',
            data: { iTransId: iTransId , sApiName:"ReceiptDetails" },
            success: function (data) {
               
                data = JSON.parse(data);
                data = data.ResultData;
                // alert("1."+data)
                data = JSON.parse(data);
               // alert("EDIT" + JSON.stringify(data));
                _attachment = data.Table3;//Attachment
                _BillWiseReferenceEdit = data.Table2;

                // alert("_attachment" + JSON.stringify(_attachment));
                console.log("Edit" + JSON.stringify(data));
        //        referenceData_load = [];
        //        $("#bindmainTable").html("");
               // $("#hdn_iTransID").val(data.Table[0].iTransId);
                $("#tdoc_no").val(data.Table[0].sDocNo);
                $("#tdate").val(data.Table[0].sDocDate);
                $("#Company").val(data.Table[0].sCompany);//
                $("#Company-id").val(data.Table[0].iCompany);//
                $("#Bank").val(data.Table[0].sAccount1);//
                $("#Bank-id").val(data.Table[0].iAccount1);//
                $("#tCheqDate").val(data.Table[0].sChqDate);//
                $("#tCheqNo").val(data.Table[0].sChqNo);//
                $("#tbillno").val(data.Table[0].sBillNo);//
                $("#PlaceOfSupply").val(data.Table[0].sPOS);//
                //alert("pos" + data.Table[0].iPOS)
                //alert("Jurisdiction" + data.Table[0].iJur)
                $("#PlaceOfSupply-id").val(data.Table[0].iPOS);//
                $("#Jurisdiction").val(data.Table[0].sJur);//
                $("#Jurisdiction-id").val(data.Table[0].iJur);//
                $("#InterCo").val(data.Table[0].sInterCo);//
                $("#InterCo-id").val(data.Table[0].iInterCo);//
                $("#iCurrency").val(data.Table[0].sCurrency);//
                $("#iCurrency-id").val(data.Table[0].iCurrency);//
                $("#fExchangeRate").val(data.Table[0].fExchRate);//
                //$("#tAmount").val(data.Table[0].fAmount);//
                $("#tNarration").val(data.Table[0].sNarration);

                $("#btnPost").prop("disabled", true);//EDIT is disabled from this project 
                $("#btnPostPrint").prop("disabled", true);//EDIT is disabled from this project
                if (data.Table[0].istatus == 0) {//editable - checking whether doc no is used in anyother ref
                    //$("#btnPost").prop("disabled", false);
                    $("#btnDelete").prop("disabled", false);
                }
                else {//not editable
                   // $("#btnPost").prop("disabled", true);
                    $("#btnDelete").prop("disabled", true);
                }
                $("#Company").prop('disabled', true);
                $("#iCurrency").prop('disabled', true);
                $("#fExchangeRate").prop('disabled', true);       
                body = data.Table1;              
               
                for (iId = 0; iId < data.Table1.length; iId++) {
                                      
                    //alert("sTradeNo" + body[iId].sTag1)
                    //alert("iTradeNoId" + body[iId].iTag1)
                    $("#iTag1_" + iId).val(body[iId].sTag1);
                    $("#iTag1_" + iId + "-id").val(body[iId].iTag1);
                    //var sDivision = body[iId].sTag2;
                    //var iDivisionId = body[iId].iTag2;
                    $("#iTag2_" + iId).val(body[iId].sTag2);
                    $("#iTag2_" + iId + "-id").val(body[iId].iTag2);

                    //var sCostCentre = body[iId].sTag4;
                    //var iCostCentreId = body[iId].iTag4;

                    $("#iTag4_" + iId).val(body[iId].sTag4);
                    $("#iTag4_" + iId + "-id").val(body[iId].iTag4);

                    //var sProject = body[iId].sTag5;
                   // var iProjectId = body[iId].iTag5;
                    $("#iTag5_" + iId).val(body[iId].sTag5);
                    $("#iTag5_" + iId + "-id").val(body[iId].iTag5);
                    //var sBusinessUnit = body[iId].sTag6;
                   // var iBusinessUnitId = body[iId].iTag6;
                    $("#iTag6_" + iId).val(body[iId].sTag6);
                    $("#iTag6_" + iId + "-id").val(body[iId].iTag6);

                   // var sLocation = body[iId].sTag7;
                   // var iLocationId = body[iId].iTag7;
                    $("#iTag7_" + iId).val(body[iId].sTag7);
                    $("#iTag7_" + iId + "-id").val(body[iId].iTag7);
                    var sSubTrade = body[iId].sTag8;
                    $("#iTag8_" + iId).val(body[iId].sTag8);
                    $("#iTag8_" + iId + "-id").val(body[iId].iTag8);var iSubTradeId = body[iId].iTag8;

                    //var sCreditAccount = body[iId].sAccount2;
                    //var iCreditAccountId = body[iId].iAccount2;
                    $("#CreditAccount_" + iId).val(body[iId].sAccount2);
                    $("#CreditAccount_" + iId + "-id").val(body[iId].iAccount2);

                    var fAmount = body[iId].fAmount;
                    
                    $("#Amount_" + iId).val(body[iId].fAmount);
                  //  var sReference = body[iId].sCreditAccount;
                  //  var iReferenceId = body[iId].iOutlet;

                   // var sRemarks = body[iId].sRemarks;
                    $("#Remarks_" + iId).val(body[iId].sRemarks);
                    //var sTaxCode = body[iId].iTaxCode;
                    $("#TaxCode_" + iId).val(body[iId].sTaxCode);
                    $("#TaxCode_" + iId+"-id").val(body[iId].iTaxCode);
                    //var fVat = body[iId].fVat;
                    $("#Vat_" + iId).val(body[iId].fVat);

                   // var sRelatedParty = body[iId].sRelParty;
                   //var iRelatedPartyId = body[iId].iRelParty;
                    $("#RelatedParty_" + iId).val(body[iId].sRelParty);
                    $("#RelatedParty_" + iId + "-id").val(body[iId].iRelParty);
                    if (body[iId].iType == 3) {//cust/vendor type so Ref txtbox is enabled
                        $("#Reference_" + iId).prop("disabled", false);
                    }
                    else {
                        $("#Reference_" + iId).prop("disabled", true);
                    }


                    var iTransDtId = body[iId].iTransDtId;

                    //----------| *BWR* |-----------------//
                    var batchId = 0;
                    var _sReference = "";// _sBatch = "";

                    for (batchId = 0; batchId < _BillWiseReferenceEdit.length; batchId++) {
                        if (iTransDtId == _BillWiseReferenceEdit[batchId].iTransDtId) {
                            // alert("MfgDate" + _convertDate(batch[batchId].iMfDate));
                            var _reference = { "iRow": iId, "iAccount": body[iId].iAccount2, "sDocNo": _BillWiseReferenceEdit[batchId].sDocNo, "iRef": _BillWiseReferenceEdit[batchId].iRef, "fQty": _BillWiseReferenceEdit[batchId].fAmount, "iRefType": _BillWiseReferenceEdit[batchId].iRefType};  //fBatchQty
                            referenceData_load.push(_reference);
                            _sReference += "," + _BillWiseReferenceEdit[batchId].sDocNo;
                           
                            $("#Reference_" + iId).val(_sReference);
                        }

                        


                    }
                    if ($("#Reference_" + iId).val() != "" && $("#Reference_" + iId).val() != null) {
                        var _sBatchnew = $("#Reference_" + iId).val()
                        _sBatchnew = _sBatchnew.substring(1);
                        $("#Reference_" + iId).val(_sBatchnew);
                    }


                    addRow(iId);
                }
                var _attchid = 0;
                if (_attachment.length > 0) {
                    // var newAttachList = [];
                    // alert("_attachment yzz" + JSON.stringify(_attachment));
                    var newAttachments = {};
                    // for (_attchid = 0; _attchid < _attachment.length; _attchid++) 
                    {
                        //newAttachments.iSiNo = _attachment[_attchid].iSiNo;
                        //newAttachments.sFileName = _attachment[_attchid].sFileName;
                       // newAttachments.sFilepath = _attachment[_attchid].sFileName;                                             
                        //alert("edit"+JSON.stringify(newAttachments));
                        
                        UploadType = 1;
                        $.ajax({
                            //url: "/FocusMaxTransaction/FileUploadEdit?dh=" + JSON.stringify(newAttachments),
                            url: "/FocusMaxTransaction/FileUploadEdit?dh=" + JSON.stringify(_attachment),
                            type: "POST",
                            contentType: false,
                            processData: false,
                            success: function (data) { }
                        });
                    }
                    addRowFilegrid(_attachment);
                    // addRowFilegrid(newAttachList);
                }
                else {
                    $("#tbltransAttachbody").html("");
                }
                setFooterdata();

      
            }
        });
    }            


    else {

        type = 1;
       

            }
        }


//function addRow(Iid, iLoginUser) {
function addRow(Iid) {
    // alert("addro" + $("#Amount_" + Iid).val());

    //alert("amt " + amt)

    if ($("#Company-id").val() == 0 || ($("#Company").val()=="" )) {
        runError("Select Company");
    }
    else if (($("#iCurrency-id").val() == 0)|| ($("#iCurrency").val()=="")) {
     
        runError("Select Currency");
    }
    else if ($("#fExchangeRate").val() == "") {
        runError("Please Fill Currency Conv ");
    }
    else {
    var tbl_input_field = "";
    var lastid = $("#receiptTransactionTableBody").find("tr").last().attr('id');
    //if (parseFloat($("#Inv_row" + Iid + "Col1").val()) < 0) {
    //    $("#Inv_row" + Iid + "Col1").val(0);
    //}
    //alert("lastid" + lastid)
    //alert("Iid" + Iid)

    if (lastid == Iid) {
        var iTransDtId = $("#receiptTransactionTableBody").find("input[type=checkbox]").last().attr('id');
        if (lastid == undefined || lastid == NaN || lastid == Infinity) {
            lastid = 0;
            iTransDtId = 0;
        }
        else {
            iTransDtId = getMaxRowID();
            iTransDtId++;
        }

        var table = document.getElementById("receiptTransactionTableBody");
        var rows = table.getElementsByTagName("tr");
        if (rows.length > 1) {
            $("#Company").prop('disabled', true);
            // $("#OutletSelect").prop('disabled', true);
        }
        // alert("iTransDtId" + iTransDtId)
        //var li_fTableRow = $('<tr id ="' + iTransDtId + '"><td style="width: 1% !important;"><input style="height: 12px; width:14px;" type="checkbox" id="' + iTransDtId + '" /></td><td class="CellWithComment"><span class="CellComment"> <i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')"></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td></tr>');
        var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="TradeNo"  type="text" id="iTag1_' + iTransDtId + '" onfocus=DataLoadCall("#iTag1_' + iTransDtId + '","GetTags","",1,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag1_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag1_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="Division"  style="width:150px;"  type="text" id="iTag2_' + iTransDtId + '" onfocus=DataLoadCall("#iTag2_' + iTransDtId + '","GetTags","",2,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag2_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag2_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="CostCentre"  type="text" id="iTag4_' + iTransDtId + '" onfocus=DataLoadCall("#iTag4_' + iTransDtId + '","GetTags","",4,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag4_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag4_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="Project"  type="text" id="iTag5_' + iTransDtId + '" onfocus=DataLoadCall("#iTag5_' + iTransDtId + '","GetTags","",5,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag5_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag5_' + iTransDtId + '-code"/></td>   <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="BusinessUnit"  type="text" id="iTag6_' + iTransDtId + '" onfocus=DataLoadCall("#iTag6_' + iTransDtId + '","GetTags","",6,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag6_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag6_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="Location"  type="text" id="iTag7_' + iTransDtId + '" onfocus=DataLoadCall("#iTag7_' + iTransDtId + '","GetTags","",7,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag7_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag7_' + iTransDtId + '-code"/></td>  <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="SubTrade"  type="text" id="iTag8_' + iTransDtId + '"  onfocus=DataLoadCall("#iTag8_' + iTransDtId + '","GetTags","",8,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag8_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag8_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="Account"  style="width:250px;"  type="text" id="CreditAccount_' + iTransDtId + '" onfocus=DataloadMaster_AccountType("#CreditAccount_' + iTransDtId + '","GetAccount",1,2) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="CreditAccount_' + iTransDtId + '-id" onchange="clearReferenceOnAccountChange(' + iTransDtId + ')" /> <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-itype"/>    <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-code"/></td> <td><input style="width:250px;" class="ui-autocomplete-input form-control mandatory" placeholder="Amount" type="text" id="Amount_' + iTransDtId + '" autocomplete="off" onblur="setFooterdata()" onkeypress="addRow(' + iTransDtId + ')" role="textbox"> </td><td> <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Reference" type="text" id="Reference_' + iTransDtId + '"  onfocus="fQtyReferencePopup(' + iTransDtId + ')" autocomplete="off" role="textbox"></td><td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Remarks" type="text" id="Remarks_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td>  <input class="ui-autocomplete-input form-control" placeholder="TaxCode"  style="width:250px;"  type="text" id="TaxCode_' + iTransDtId + '" onfocus=DataLoadCall("#TaxCode_' + iTransDtId + '","GetTaxCode","",0,"TaxCode") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="TaxCode_' + iTransDtId + '-id"  />     <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="TaxCode_' + iTransDtId + '-code"/>      </td> <td><input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="VAT" type="text" id="Vat_' + iTransDtId + '" autocomplete="off" role="textbox" onblur="roundingInputVariables(event, ' + iTransDtId + ')"></td> <td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="RelatedParty" type="text" id="RelatedParty_' + iTransDtId + '" onfocus=DataLoadCall("#RelatedParty_' + iTransDtId + '","GetRelatedParty","",0,"RelatedParty") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">  <input type="hidden" id="RelatedParty_' + iTransDtId + '-id" onchange="" value="0" /> </td>  ');
        li.appendTo($("#receiptTransactionTableBody"));

        var objDiv = document.getElementById("receiptTransactionTableBody");
        objDiv.scrollTop = objDiv.scrollHeight;
        enableCompany();

    }
    else {
        clearReference(Iid);
        $("#Reference_" + Iid).val("");
    }
    }
}

function getMaxRowID() {

    //Array to hold the value
    var rowvalues = [];
    //Loop through each table row
    $("#receiptTransactionTableBody tr").each(function () {
        //Push the value to array
        var rowvalue = [];
        rowvalue.push($(this).attr('id').replace(/[^0-9\.]+/g, ""));
       // alert("rowvalue" + rowvalue);
        rowvalues.push(rowvalue);
    });
    //Get the max value from array
    var max = Math.max.apply(Math, rowvalues);

    return max;
}
function enableCompany() {
   // if (($("#hdn_iTransID").val() == "") || ($("#hdn_iTransID").val() == 0))
    {
        var table = document.getElementById("receiptTransactionTableBody");
        var rows = table.getElementsByTagName("tr");
        var len = rows.length;
        // alert("len" + len)
        if (len == 1) {
            $("#Company").prop('disabled', false);
            $("#iCurrency").prop('disabled', false);
            $("#fExchangeRate").prop('disabled', false);

        }
        else {
            $("#Company").prop('disabled', true);
            $("#iCurrency").prop('disabled', true);
            $("#fExchangeRate").prop('disabled', true);

        }
    }

}

function addLine(ids) { //Add Row in between

    //alert("addLine I " + ids)
    var iLoginUser = $("#hdn_SessionUID").val();
    var id = parseFloat(ids);
    var iTransDtId = 0;
    var rowIndex = parseInt($('#receiptTransactionTableBody tr#' + id + '').index());
   // alert("rowIndex addline" + rowIndex)
    var tab_id = $("#receiptTransactionTableBody").find("tr").last().attr('id');
    if (ids == tab_id) {
        runError("Cannot add row in last row")
        return false;
    }
    var iId = getMaxRowID();
    //alert("addLine II " + iId)
    iTransDtId = iId+1; //+1
    //var tbl_input_field = "";//tbl_input_field_li="";
    ////static table fields
    ////<td style="width:200px"> <input type="hidden" id="hdnBatch' + iTransDtId +'" value="true"> <input type="text" style="width:200px" class="bodyText bodyShow form-control" id="Batch' + iTransDtId +'" onfocus="getInvrow_column(event,-1)">   </td> <td style="width:200px"> <input type="hidden" id="hdnSerial' + iTransDtId +'"> <input type="text" style="width:200px" class="bodyText form-control" id="SerialNo' + iTransDtId +'" autocomplete="off" onfocus="getInvrow_column(event,'+iTransDtId+')"></td>
    ////var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control" placeholder="Item"  type="text" id="ProductSelect' + iTransDtId + '" onfocus=DataloadMaster("#ProductSelect' + iTransDtId + '",8) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="ProductSelect' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="ProductSelect' + iTransDtId + '-code"/></td><td><input type="number" style="width:100%;" class="form-control" placeholder="Qty" id="Inv_row' + iTransDtId + 'Col1" value=' + this.fQty + ' onclick="add_row(' + iTransDtId + ')" onkeypress="add_row(' + iTransDtId + ')" autocomplete="off" onfocusout="tot_quantity(' + iTransDtId + ',0)" min="0" oninput="this.value = Math.abs(this.value)"/></td><td><input type="number" style="width:100%;" class="form-control " placeholder="Rate" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  id="Inv_row' + iTransDtId + 'Col2" autocomplete="off" /></td><td><input type="number" class="form-control " placeholder="Gross"  id="Inv_row' + iTransDtId + 'Col3" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  autocomplete="off" /></td>' + tbl_input_field + '</tr>');
    ////var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control" placeholder="Item"  type="text" id="ProductSelect' + iTransDtId + '" onfocus=DataloadMaster("#ProductSelect' + iTransDtId + '",' + iTransDtId + ',2,' + iLoginUser+') autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="ProductSelect' + iTransDtId + '-id" onchange="getbBatchSNo(' + iTransDtId + ')" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="ProductSelect' + iTransDtId + '-code"/></td><td><input type="number" style="width:100%;" class="form-control" placeholder="Qty" id="Inv_row' + iTransDtId + 'Col1" value=' + this.fQty + ' onclick="add_row(' + iTransDtId + ')" onkeypress="add_row(' + iTransDtId + ')" autocomplete="off" onfocusout="tot_quantity(' + iTransDtId + ',0)" min="0" oninput="this.value = Math.abs(this.value)"/></td><td><input type="number" style="width:100%;" class="form-control " placeholder="Rate" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  id="Inv_row' + iTransDtId + 'Col2" autocomplete="off" /></td><td><input type="number" class="form-control " placeholder="Gross"  id="Inv_row' + iTransDtId + 'Col3" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  autocomplete="off" /></td><td style="width:200px"> <input type="hidden" id="hdnbBatch' + iTransDtId + '" value="true"> <input type="text" style="width:200px" autocomplete="off" class="form-control" id="Batch' + iTransDtId + '" onfocus="getInvrow_column(event,' + iTransDtId +')">   </td> <td style="width:200px"> <input type="hidden" id="hdnbSerial' + iTransDtId + '"> <input type="text" style="width:200px" class="form-control" id="SerialNo' + iTransDtId + '" autocomplete="off" onfocus="getInvrow_column(event,' + iTransDtId +')"></td>' + tbl_input_field + '</tr>');
    //var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control" placeholder="Item"  type="text" id="ProductSelect' + iTransDtId + '" onfocus=DataloadMaster("#ProductSelect' + iTransDtId + '",' + iTransDtId + ',2,' + iLoginUser + ') autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="ProductSelect' + iTransDtId + '-id" onchange="getbBatchSNo(' + iTransDtId + ')" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="ProductSelect' + iTransDtId + '-code"/></td><td><input type="number" style="width:100%;" class="form-control" placeholder="Qty" id="Inv_row' + iTransDtId + 'Col1" value=' + this.fQty + ' onclick="add_row(' + iTransDtId + ')" onkeypress="add_row(' + iTransDtId + ')" autocomplete="off" onfocusout="tot_quantity(' + iTransDtId + ',0)" min="0" oninput="this.value = Math.abs(this.value)"/></td><td><input type="number" style="width:100%;" class="form-control " placeholder="Rate" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  id="Inv_row' + iTransDtId + 'Col2" autocomplete="off" /></td><td><input type="number" class="form-control " placeholder="Gross"  id="Inv_row' + iTransDtId + 'Col3" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')"  autocomplete="off" /></td><td style="width:200px"> <input type="hidden" id="hdnbBatch' + iTransDtId + '" value="true"> <input type="text" style="width:200px" autocomplete="off" class="form-control" id="Batch' + iTransDtId + '" onfocus="getInvrow_column(event,' + iTransDtId + ')">   </td> <td style="width:200px"> <input type="hidden" id="hdnbSerial' + iTransDtId + '"> <input type="text" style="width:200px" class="form-control" id="SerialNo' + iTransDtId + '" autocomplete="off" onfocus="getInvrow_column(event,' + iTransDtId + ')"></td></tr>');
    //$('#transactionTable > tbody > tr:eq(' + rowIndex + ')').before(li);
    // var li_fTableRow = $('<tr id="' + iTransDtId + '"><td style="width: 1% !important;"><input style="height: 12px; width:14px;" type="checkbox" id="' + iTransDtId + '" /></td>  <td class="CellWithComment"><span class="CellComment"> <i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')"></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td> <td style="width:250px;"> <input style="width:250px;" class="ui-autocomplete-input form-control " placeholder="Item" type="text" id="ProductSelect' + iTransDtId + '" onfocus=DataloadMaster("#ProductSelect' + iTransDtId + '",' + iTransDtId + ',2) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"> <input type="hidden" id="ProductSelect' + iTransDtId + '-id" onchange="getbBatchSNo(' + iTransDtId + ')"   /> <input type="hidden" style="border: transparent;background-color: transparent;" readonly="readonly" id="ProductSelect' + iTransDtId + '-code" /> </td>   <td onclick="add_row(' + iTransDtId + ')" onkeypress="add_row(' + iTransDtId + ')" style="width:100px"><input type="number" style="width:100px" class="form-control " placeholder="Qty" id="Inv_row' + iTransDtId + 'Col1" autocomplete="off" onfocusout="tot_quantity(' + iTransDtId + ')" /></td><td>  <input type="number" style="width:100px" class="form-control " placeholder="Rate" id="Inv_row' + iTransDtId + 'Col2" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')" autocomplete="off" /></td>    <td id="gross_row' + iTransDtId + '" style="width:100px"><input type="text" style="width:100px" class="form-control " placeholder="Gross" id="Inv_row' + iTransDtId + 'Col3" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')" autocomplete="off" /></td> <td style="width:200px"> <input type="hidden" id="hdnbBatch' + iTransDtId + '" value="true"> <input type="text" style="width:200px" class="bodyText bodyShow form-control" autocomplete="off" id="Batch' + iTransDtId + '" onfocus="getInvrow_column(event,' + iTransDtId + ')">   </td> <td style="width:200px"> <input type="hidden" id="hdnbSerial' + iTransDtId + '"> <input type="text" style="width:200px" class="bodyText form-control" id="SerialNo' + iTransDtId + '" autocomplete="off" onfocus="getInvrow_column(event,' + iTransDtId + ')">  </td> </tr >');

    // var li_fTableRow = $('<tr id="' + iTransDtId + '"><td style="width: 1% !important;"><input style="height: 12px; width:14px;" type="checkbox" id="' + iTransDtId + '" /></td>  <td class="CellWithComment"><span class="CellComment"> <i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ',' + iLoginUser + ')"></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td>   </tr >');
    // li_fTableRow.appendTo($("#transactionTableBody"));
   
   // var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="TradeNo"  type="text" id="iTag1_' + iTransDtId + '" onfocus=DataLoadCall("#iTag1_' + iTransDtId + '","GetTags","",1,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag1_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag1_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="Division"  type="text" id="iTag2_' + iTransDtId + '" onfocus=DataLoadCall("#iTag2_' + iTransDtId + '","GetTags","",2,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag2_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag2_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="CostCentre"  type="text" id="iTag4_' + iTransDtId + '" onfocus=DataLoadCall("#iTag4_' + iTransDtId + '","GetTags","",4,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag4_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag4_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="Project"  type="text" id="iTag5_' + iTransDtId + '" onfocus=DataLoadCall("#iTag5_' + iTransDtId + '","GetTags","",5,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag5_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag5_' + iTransDtId + '-code"/></td>   <td><input class="ui-autocomplete-input form-control mandatory" placeholder="BusinessUnit"  type="text" id="iTag6_' + iTransDtId + '" onfocus=DataLoadCall("#iTag6_' + iTransDtId + '","GetTags","",6,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag6_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag6_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="Location"  type="text" id="iTag7_' + iTransDtId + '" onfocus=DataLoadCall("#iTag7_' + iTransDtId + '","GetTags","",7,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag7_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag7_' + iTransDtId + '-code"/></td>  <td><input class="ui-autocomplete-input form-control mandatory" placeholder="SubTrade"  type="text" id="iTag8_' + iTransDtId + '"  onfocus=DataLoadCall("#iTag8_' + iTransDtId + '","GetTags","",8,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag8_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag8_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="Account"  type="text" id="CreditAccount_' + iTransDtId + '" onfocus=DataloadMaster_AccountType("#CreditAccount_' + iTransDtId + '","GetAccount",1,2) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="CreditAccount_' + iTransDtId + '-id" onchange="clearReferenceOnAccountChange(' + iTransDtId + ')" /> <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-itype"/>   <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-code"/></td> <td><input style="width:250px;" class="ui-autocomplete-input form-control mandatory" placeholder="Amount" type="text" id="Amount_' + iTransDtId + '" onkeypress="addRow(' + iTransDtId + ')"  autocomplete="off" role="textbox"> </td><td> <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Reference" type="text" id="Reference_' + iTransDtId + '"  onfocus="fQtyReferencePopup(' + iTransDtId + ')" autocomplete="off" role="textbox"></td><td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Remarks" type="text" id="Remarks_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td> <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="TaxCode" type="text" id="TaxCode_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td><input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="VAT" type="text" id="Vat_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="RelatedParty" type="text" id="RelatedParty_' + iTransDtId + '" onfocus=DataLoadCall("#RelatedParty_' + iTransDtId + '","GetRelatedParty","",0,"RelatedParty") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">  <input type="hidden" id="RelatedParty_' + iTransDtId + '-id" onchange="" value="0" /> </td>  ');
    var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="TradeNo"  type="text" id="iTag1_' + iTransDtId + '" onfocus=DataLoadCall("#iTag1_' + iTransDtId + '","GetTags","",1,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag1_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag1_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="Division"  style="width:150px;"  type="text" id="iTag2_' + iTransDtId + '" onfocus=DataLoadCall("#iTag2_' + iTransDtId + '","GetTags","",2,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag2_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag2_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="CostCentre"  type="text" id="iTag4_' + iTransDtId + '" onfocus=DataLoadCall("#iTag4_' + iTransDtId + '","GetTags","",4,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag4_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag4_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="Project"  type="text" id="iTag5_' + iTransDtId + '" onfocus=DataLoadCall("#iTag5_' + iTransDtId + '","GetTags","",5,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag5_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag5_' + iTransDtId + '-code"/></td>   <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="BusinessUnit"  type="text" id="iTag6_' + iTransDtId + '" onfocus=DataLoadCall("#iTag6_' + iTransDtId + '","GetTags","",6,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag6_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag6_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="Location"  type="text" id="iTag7_' + iTransDtId + '" onfocus=DataLoadCall("#iTag7_' + iTransDtId + '","GetTags","",7,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag7_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag7_' + iTransDtId + '-code"/></td>  <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="SubTrade"  type="text" id="iTag8_' + iTransDtId + '"  onfocus=DataLoadCall("#iTag8_' + iTransDtId + '","GetTags","",8,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag8_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag8_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="Account"  style="width:250px;"  type="text" id="CreditAccount_' + iTransDtId + '" onfocus=DataloadMaster_AccountType("#CreditAccount_' + iTransDtId + '","GetAccount",1,2) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="CreditAccount_' + iTransDtId + '-id" onchange="clearReferenceOnAccountChange(' + iTransDtId + ')" /> <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-itype"/>    <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-code"/></td> <td><input style="width:250px;" class="ui-autocomplete-input form-control mandatory" placeholder="Amount" type="text" id="Amount_' + iTransDtId + '" autocomplete="off" onblur="setFooterdata()" onkeypress="addRow(' + iTransDtId + ')" role="textbox"> </td><td> <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Reference" type="text" id="Reference_' + iTransDtId + '"  onfocus="fQtyReferencePopup(' + iTransDtId + ')" autocomplete="off" role="textbox"></td><td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Remarks" type="text" id="Remarks_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td> <input class="ui-autocomplete-input form-control" placeholder="TaxCode"  style="width:250px;"  type="text" id="TaxCode_' + iTransDtId + '" onfocus=DataLoadCall("#TaxCode_' + iTransDtId + '","GetTaxCode","",0,"TaxCode") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="TaxCode_' + iTransDtId + '-id"  />     <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="TaxCode_' + iTransDtId + '-code"/>    </td> <td><input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="VAT" type="text" id="Vat_' + iTransDtId + '" autocomplete="off" role="textbox" onblur="roundingInputVariables(event, ' + iTransDtId + ')"></td> <td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="RelatedParty" type="text" id="RelatedParty_' + iTransDtId + '" onfocus=DataLoadCall("#RelatedParty_' + iTransDtId + '","GetRelatedParty","",0,"RelatedParty") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">  <input type="hidden" id="RelatedParty_' + iTransDtId + '-id" onchange="" value="0" /> </td>  ');
    //li.appendTo($("#receiptTransactionTableBody"));

    //<td style="width:250px;"> <input style="width:250px;" class="ui-autocomplete-input form-control " placeholder="Item" type="text" id="ProductSelect0" onfocus=DataloadMaster("#ProductSelect' + iTransDtId + '", 0 ,2,' + iLoginUser + ') autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"> <input type="hidden" id="ProductSelect' + iTransDtId + '-id" onchange="getbBatchSNo(' + iTransDtId + ')"   />  </td>     <td style="width:350px;"> <input type="text" style="width:350px;" class="form-control" placeholder="Description" autocomplete="off" readonly   id="ProductSelect' + iTransDtId + '-code" onchange="getbBatch(' + iTransDtId + ')" />     </td>          <td style="width:250px;"><input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Unit"   type="text" id="UnitSelect' + iTransDtId + '" onfocus=DataloadMaster("#UnitSelect' + iTransDtId + '",-1,7,' + iLoginUser + ')     autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"  /><input type="hidden" id="UnitSelect0-id"   /></td>              <td onclick="add_row(' + iTransDtId + ')" onkeypress="add_row(' + iTransDtId + ')" style="width:100px"><input type="number" style="width:100px" class="form-control " placeholder="Qty" id="Inv_row' + iTransDtId + 'Col1" autocomplete="off" onfocusout="tot_quantity(' + iTransDtId + ')" /></td><td>  <input type="number" style="width:100px" class="form-control " placeholder="Rate" id="Inv_row' + iTransDtId + 'Col2" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')" autocomplete="off" /></td>    <td id="gross_row' + iTransDtId + '" style="width:100px"><input type="text" style="width:100px" class="form-control " placeholder="Gross" id="Inv_row' + iTransDtId + 'Col3" onblur="onBlurInvTotal(event,' + iTransDtId + ')" onfocus="getInvrow_column(event,' + iTransDtId + ')" autocomplete="off" /></td> <td style="width:200px"> <input type="hidden" id="hdnbBatch' + iTransDtId + '" value="true"> <input type="text" style="width:200px" class="bodyText bodyShow form-control" id="Batch' + iTransDtId + '" onfocus="getInvrow_column(event,' + iTransDtId + ')">   </td> <td style="width:200px"> <input type="hidden" id="hdnbSerial' + iTransDtId + '"> <input type="text" style="width:200px" class="bodyText form-control" id="SerialNo' + iTransDtId + '" autocomplete="off" onfocus="getInvrow_column(event,' + iTransDtId + ')">  </td>     <td style="width:250px;"> <input style="width:250px;" class="ui-autocomplete-input form-control " placeholder="Purchase Account" type="text" id="PurchaseSelect' + iTransDtId + '" onfocus=DataloadMaster("#PurchaseSelect' + iTransDtId + '",-1,1,' + iLoginUser + ') autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"> <input type="hidden" id="PurchaseSelect' + iTransDtId + '-id"    />  </td>  
    $('#receiptTransactionTable > tbody > tr:eq(' + rowIndex + ')').before(li); //before
    enableCompany();
}

function deleteLine(iId) {
    //$("label[for='msg']").text("Do you want to Delete this Row?");
    //$("#modal-DeleteLineConfirm").show();
    //$("#delete_id").val(iId); //hidden field

    var table = document.getElementById("receiptTransactionTableBody");
    var rows = table.getElementsByTagName("tr");
    var len = (rows.length);
    var rowIndex = $('#receiptTransactionTableBody tr#' + iId + '').index();
    if ((rowIndex + 1) != len) {//should not del last row

        $("label[for='msgRowDel']").text("Do you want to Delete Row '" + (rowIndex + 1) + "' ?");
        $("#modal-DeleteLineConfirm").show();
        $("#delete_id").val(iId); //hidden field
    }
    else {
        runError('cannot delete last row');

    }
    

}


$("#btncloseline").click(function () {
    $("#modal-DeleteLineConfirm").hide();
});
$("#btnyesline").click(function () {
    //var rw_id = $("#delete_id").val();
    //var tab_len = $("#TableBodyData").find("tr").length;
    //var table = document.getElementById("TableBodyData");

    //for (var j = 0; j < tab_len; j++) {
    //    var row = table.rows[j];
    //    var l_id = row.id;
    //}
    //if (tab_len != 1) {
    //    if (rw_id == l_id) {
    //        runError("cannot delete last row!!")

    //    } else {

    //        document.getElementById(rw_id).remove();
    //    }
    //} else {
    //    runError("cannot delete this row!!")
    //}
    //$("#modal-DeleteLineConfirm").hide();

    $("#modal-DeleteLineConfirm").hide();
    var id = $("#delete_id").val(); // $("#hdn_RowDel").val();
    // var iProduct = $("#ProductSelect" + id + "-id").val();
    clearReference(id);
   // clearSerialNoSequence(id);
    $('#receiptTransactionTableBody tr#' + id + '').remove();
    setFooterdata();
    //btnLess();
    enableCompany();

});
$("#btnnoline").click(function () {
    $("#modal-DeleteLineConfirm").hide();
});

//---------------------| File Upload |-----------------------------------//


var f = "";
var filepath = "";

var UploadType = 1;
$("#txticount").val(0);

function uploadtransfiles() {
    //$('#imgup').addClass('show');
    $("#hdnAttachDel_rowID").val(0);
    var s1 = {};
    //$("#docAttchval").val(1); //not req
    // $("#isiNo").val(1); //my
    s1.iSiNo = $("#isiNo").val();
    //s1.iDocType = $("#docAttch-id").val();//docAttchval
    //s1.sDocType = $("#docAttch").val();
    /*s1.sRefNo = $("#docRefNo").val();*/
    s1.sFileName = f;
    s1.sFilepath = filepath;
    var fd = new FormData();
    var uploadFlag = true;
    //alert("s1" + JSON.stringify(s1) + "docAttch: " + $("#docAttch").val());
     //   alert("Len " + $("#file").get(0).files.length);
    for (var i = 0; i < $("#file").get(0).files.length; i++) {
        fd.append("files" + i, $("#file").get(0).files[i]);
        var iFlength = $('#file')[0].files[i].name.length;

        var fsize = $('#file')[0].files[i].size;
        fsize = Math.round(fsize / 1024);
        if (fsize > 20480) {
            
            $("#lblUploadError").text("File exceeds the limit allowed, please select a file less than 20MB");
            uploadFlag = false;
            
        }
        else if (iFlength > 150) {
            $("#lblUploadError").text("File name exceeds the limit allowed. (Max. 150 Chars)");
            uploadFlag = false;
        }
        
    }
    //const fi = document.getElementById('file');

    // alert("fd" + JSON.stringify(fd));
    //alert("UploadType" + UploadType);
   
    if (attatchvalid(s1) && uploadFlag) {
        $("#uploaddocs").prop("disabled", true);
        //if (UploadType == 1 || UploadType == 2 || UploadType == 5 || UploadType == 6 || UploadType == 3)
        if (UploadType == 1) {
            //alert("in attatchvalid & in UploadType Request Entity Too Large");
            $.ajax({
                url: "/FocusMaxTransaction/FileUpload?dh=" + JSON.stringify(s1) + "&ivType=" + $("#hdn_iVoucherType").val(),
                data: fd,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (data, headers, status, config, files) {
                    filesdata = [];
                    filesdata = data;
                    // alert("Uploadz" + JSON.stringify(data.msg));
                    console.log("Uploadz **" + JSON.stringify(data));
                    if (data.msg != null) {
                        $("#uploaddocs").prop("disabled", false);
                        $("#lblUploadError").text(data.msg)
                    }
                    else {
                        $("#lblUploadError").text("");
                        $("#isiNo").val(0);
                        // $("#docAttchval").val("");
                        //$("#docAttch").val("");
                        $("#txtDocumentName").val("");
                        //  $("#docRefNo").val("");
                        $("#file").val("");
                        $('#imgup').removeClass('show');
                        //UploadType = 1;//may 7
                        addRowFilegrid(data.record);
                    }


                },
                //error: function (response) {
                //    $.ajax({
                //        url: "/Master/Error",
                //        data: { Message: response.responseText },
                //        success: function (data, res) {
                //        }
                //    });
                //}
            });
        }
        //else if (UploadType == 4){//Edit in Actions colm of tb
        else {
            $.ajax({
                url: "/FocusMaxTransaction/EditPhoto?dh=" + JSON.stringify(s1) + "&ivType=" + $("#hdn_iVoucherType").val(),
                data: fd,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (data, headers, status, config, files) {
                    filesdata = [];
                    filesdata = data;
                    console.log("EditPhoto **" + JSON.stringify(data));
                    $("#uploaddocs").prop("disabled", false);
                    if (data.msg != null) {
                        $("#lblUploadError").text(data.msg)
                    }
                    else {
                        $("#lblUploadError").text("");
                        $("#isiNo").val(0);
                        //$("#docAttchval").val("");
                        // $("#docAttch").val("");
                        $("#txtDocumentName").val("");
                        // $("#docRefNo").val("");
                        $("#file").val("");
                        $('#imgup').removeClass('show');
                        // UploadType = 1;
                        // alert("EditPhoto" + JSON.stringify(data));
                        addRowFilegrid(data.record);
                        UploadType = 1;
                    }

                },
                //error: function (response) {
                //    $.ajax({
                //        url: "/Master/Error",
                //        data: { Message: response.responseText },
                //        success: function (data, res) {
                //        }
                //    });
                //}
            });
        }
    }
    else {
        $("#uploaddocs").prop("disabled", false);

    }
}
var attgrid = [];
function addRowFilegrid(items) {
   // alert("addRowFilegrid || " + JSON.stringify(items));
    if (items == "[]") {
        var rowCountAttch = $('#tbltransAttachbody tr').length;
        // alert("rowCountAttch" + rowCountAttch)
        if (rowCountAttch == 1) {
            $("#tbltransAttachbody").html("");
        }
        //UploadType = 1;
        //runError("Invalid File");       

    }
    else {
        items.sort(function (x, y) { //req
            return x.iSiNo - y.iSiNo;
        });

        //alert("addRowFilegrid || " + JSON.stringify(items));
        // if (UploadType == 3 ) {
        attgrid = items;
        //alert("addRowFilegrid || " + JSON.stringify(attgrid));
        //}
        //else {
        //  attgrid = items.record;//items
        //}
        var id = 0;
        var sdt = "", srefNo = "";
        $("#tbltransAttachbody").html("");  
        items = attgrid; //.record;
        // alert("UploadType" + UploadType)
        // alert("addRowFilegrid || " + JSON.stringify(items));
        var fname = "", extension="";
        $.each(items, function () {
            sdt = this.sDocType;
            srefNo = this.sRefNo;
            fname = this.sFileName;
           // alert("items in each this.sFileName" + this.sFileName);
            const myArray = fname.split("___");
            fname= myArray[0];
            const forExtension = myArray[1].split(".")
            extension = forExtension[1];
            fname = fname + "." + extension;
            //alert("dt" + dt + "UploadType" + UploadType)
            //alert("items in each" + JSON.stringify(items));
           // alert("items in each fname" + fname);
            var isiNo = id + 1;
            //refNo
            //var li = $('<tr id="attrow' + id + '"><td id="iSiNo' + id + '">' + isiNo + '</td><td >' + sdt + '<input type="hidden" id="iDocType' + id + '" value=' + this.iDocType + '></td><td id="refNo' + id + '">' + srefNo + '</td><td>  <a  href="viewpath?Id=' + new String(this.sFileName) + '" target="_blank"><i class="zmdi zmdi-edit"></i></a>  <input type="hidden"  id="fileName' + id + '"  value="' + this.sFileName + '" /></td><td><div class="row" style=" margin-right: -40px;"><div class="col-sm-3"><button id="Edit' + id + '"  class="btn btn-primary btn-round btn-sm" onClick="onClickattatchgridAction(' + id + ',1,event)"><i class="zmdi zmdi-edit"></i></button> </div><div class="col-sm-3"><button id="Close' + id + '"  class="btn btn-primary btn-round btn-sm" onClick="onClickattatchgridAction(' + id + ',2,event)"><i class="zmdi zmdi-close"></i></button></div></div></td></tr>');
            var li = $('<tr id="attrow' + id + '"><td id="iSiNo' + id + '">' + isiNo + '</td><td id="refNo' + id + '" style="text-align: center; overflow-wrap: anywhere;">' + fname + '</td><td>  <a  href="viewpath?Id=' + new String(this.sFileName) + '" target="_blank"><i class="zmdi zmdi-edit"></i></a>  <input type="hidden"  id="fileName' + id + '"  value="' + this.sFileName + '" /></td><td><div class="row" style=" margin-right: -40px;"><div class="col-sm-3"><button id="Edit' + id + '"  class="btn btn-primary btn-round btn-sm" onClick="onClickattatchgridAction(' + id + ',1,event)"><i class="zmdi zmdi-edit"></i></button> </div><div class="col-sm-3"><button id="Close' + id + '"  class="btn btn-primary btn-round btn-sm" onClick="onClickattatchgridAction(' + id + ',2,event)"><i class="zmdi zmdi-close"></i></button></div></div></td></tr>');
            li.appendTo($("#tbltransAttachbody"));
            id++;
        });


    }
    $("#uploaddocs").prop("disabled", false);
}

function attatchvalid(s1) {
    var flag = true;
    var errMsg = "";
    if (($("#file").get(0).files.length == 0) && (UploadType == 1)) { //
        errMsg += "Select File..!!";
        flag = false;
        $("#uploaddocs").prop("disabled", false);
    }


    //if (((s1.sDocType.length == 0) || (s1.iDocType == 0)) && (UploadType == 1)) { //
    //    errMsg += "Select Document Type..!!";
    //    flag = false;
    //}

    if (flag == false) {
        $('#imgup').removeClass('show');
        $("#uploaddocs").prop("disabled", false);
        runError(errMsg)
    }
    else {
        return flag;
    }


}

function onClickattatchgridAction(id, attach_type, evt) {
    var _type = attach_type;
    // alert("onClickattatchgridAction" + JSON.stringify(attgrid)+"id"+id);
    for (var i = 0; i < attgrid.length; i++) {
        if (id != i) {
            $('#attrow' + i + '').removeClass('selectRow');
        }
    }

    $('#attrow' + id + '').addClass('selectRow');
    $("#hdnAttachDel_rowID").val(id);
    var c = attgrid[id];//attgrid[id];
    //alert("onClickattatchgridAction MyC" + JSON.stringify(c) + "id " + id + "type " + type + "UploadType" + UploadType);
    if (_type == 1) {//Edit in attachments
        // UploadType = 4; //2
        UploadType = 2;

        // if (type == 1) {
       
        $("#isiNo").val(c.iSiNo);
        //$("#docAttchval").val(c.iDocType);
        //$("#docAttch").val(c.sDocType);
        //$("#docAttch-id").val(c.iDocType);
        //$("#docRefNo").val(c.sRefNo);
        // $("#file").val(c.fileName);
        //  alert("docRefNo" + $("#docRefNo").val());
        f = c.sFileName;
        filepath = c.sFilepath;
        // }
        //if (type == 2) {
        //    if (UploadType == 2 || UploadType == 4 ) {
        //        //alert("in type==2 iSiNo " + c.iSiNo)
        //        //alert("in type==2 iDocType " + c.iDocType)
        //        //alert("in type==2 docType " + c.DocType)
        //        //alert("in type==2 refNo " + c.sRefNo)
        //        //alert("in type==2 fileName " + c.fileName)
        //        //alert("in type==2 filepath " + c.filepath)
        //        $("#isiNo").val(c.iSiNo);
        //        $("#docAttchval").val(c.iDocType);
        //        $("#docAttch").val(c.sDocType);
        //        $("#docRefNo").val(c.sRefNo);
        //        // $("#file").val(c.fileName);
        //        alert("docRefNo" + $("#docRefNo").val());
        //        f = c.fileName;
        //        filepath = c.filepath;
        //    }
        //    else {
        //        $("#isiNo").val(c.iSiNo);
        //        $("#docAttchval").val(c.iDocType);
        //       // $("#docAttch").val(c.sDocType);
        //       // $("#docRefNo").val(c.sRefNo);
        //        // $("#file").val(c.fileName);
        //        alert("docRefNo" + $("#docRefNo").val());
        //        f = c.fileName;
        //        filepath = c.filepath;

        //    }
        //}
    }
    else if (_type == 2) {//Del in attachments

        //alert("type" + type);
        $("label[for='msg']").text("Do you want to Delete File?");
        $("#modal-DeleteAttachmentConfirm").show();





    }
}


$("#btnattachyes").click(function () {
    $("#modal-DeleteAttachmentConfirm").hide();
    deleteAttachments();
});

$("#btnattachno").click(function () {
    $("#modal-DeleteAttachmentConfirm").hide();
})
$("#btncloseattach").click(function () {
    $("#modal-DeleteAttachmentConfirm").hide();

})

function deleteAttachments() {

    var id = $("#hdnAttachDel_rowID").val();
    var c = attgrid[id];
   // alert("c.sFilepath" + JSON.stringify(c));
    $.ajax({
        url: '/FocusMaxTransaction/DeletePhoto/',
        data: { id: c.iSiNo, filePath: c.sFilepath }, // filepath:c.filepath
        type: "POST",

        success: function (data) {
            result = parseInt(data);
            if (result > 0) {
                //    Swal.fire(
                //        'Deleted!',
                //        'Your file has been deleted.',
                //        'success'
                //    ).then(function () {

                //    });
                attgrid.splice(id, 1);
                //  alert("attgrid" + JSON.stringify(attgrid));
                //    if (type == 2 && UploadType == 1) {
                //        UploadType = 7;
                //    }
                //else {
                //    UploadType = 3;
                //}

                addRowFilegrid(attgrid);
                $("#isiNo").val(0);
               // $("#docAttchval").val(0);
               // $("#docAttch").val("");
               // $("#docRefNo").val("");
                runsuccess1('File has been deleted.');

            }

            else {
                runsuccess1('Cancelled');
                //    Swal.fire(
                //        'Cancelled',
                //        result,
                //        'error'
                //    )
            }


        }
        //,
        //error: function (response) {
        //    $.ajax({
        //        url: "/Master/Error",
        //        data: { Message: response.responseText },
        //        success: function (data, res) {
        //        }
        //    });
        //}
    });
}

//---------------------| End of File Upload |-----------------------------------//

$("#btnClose").click(function () {
    
    if (userid == 0) {
        window.location = "/Main/LogOut";
    }
    else {
        if ($('#Summary').css('display') == 'block') { // Go To Index page if clicked close btn in Summary
            window.location = '/Main/Index';
        }
        else {
            
            mainTableList = [];//used for storing id during edit.
            UploadType = 1; //attachment insert Mode
            $("#hdn_iTransID").val(0);
            DisplaySummary();
            document.getElementById("MenuBtns").children[1].style.display = "block";
            table.ajax.reload();

        }
    }
});

function checkExchangeRate() {
    //if ($("#fExchangeRate").val() < 0) {
    //    runError("Invalid ExchRate")
    //    $("#fExchangeRate").val(0);
    //}
}


function setFooterdata() {   

    //if (tSettings.bHideRateAndGross == 0) //req
    {
        //Bodycalculation of Footer Totals variables
        var index = 0;
        var i = 0;
        var totalQty = 0, totalGross = 0, totalAmt = 0;
        //var totaloutput1 = 0, totaloutput2 = 0, totaloutput3 = 0, totaloutput4 = 0, totaloutput5 = 0, totaloutput6 = 0, totaloutput7 = 0, totaloutput8 = 0, totaloutput9 = 0, totaloutput10 = 0, totaloutput11 = 0, totaloutput12 = 0, totaloutput13 = 0, totaloutput14 = 0, totaloutput15 = 0, totaloutput16 = 0, totaloutput17 = 0, totaloutput18 = 0, totaloutput19 = 0, totaloutput20 = 0;
        var n = $("#receiptTransactionTable tr:last").attr('id');
        tbl_rowN = n;
        // alert("tbl_rowN" + tbl_rowN)
        // for (var i = 1; i <= tbl_rowN; i++) {//org
        // for (var i = 0; i < tbl_rowN; i++) { //mine

        $('#receiptTransactionTable > tbody  >tr:not(:last-child)').each(function (index, tr) { //>tr:not(:last-child)
            //i = index;
            i = $(this).attr('id');
            //var iProduct = $('#row' + i + 'Productval').val();
            //var sProduct = $('#row' + i + 'Product').val();
            //if ((sProduct != undefined) && (iProduct > 0)) //--req
            {
                
                amount = $('#Amount_' + i).val();
                //alert("--i==" + i + "amount " + amount);
                //  console.log("i"+i+"each qty" + qty);
                // if (tSettings.bHideRateAndGross == 0) //req
                //{
                //    rate = $('#Rate_' + i).val();
                //    gross = $('#Gross_' + i).val();
                //    net = $('#hdnNet_' + i).val();
                //    // net = $('#row' + i + "input15").val();
                //    if (gross >= 0) {
                //        totalGross += parseFloat(gross);
                //    }

                //    if (net >= 0) {
                //        totalnetAmt += parseFloat(net);
                //    }
                //}
                if (amount >= 0) {
                    totalAmt += parseFloat(amount);
                }
            }

        });


    }

    if (totalAmt >= 0) {
        //$('#totalQty').text(numberWithCommas(totalQty.toFixed(decFixQty))); //req
        // $('#totalQty').text("Total Quantity: " + totalQty);
        document.getElementById("totalAmount").innerHTML = totalAmt;

    }
  //  alert("totalAmt" + totalAmt);

    //logtime("Ends Footer Sum")
}


// Define a function to create the table cells with input elements
function createTableCell(placeholder, width, id, onfocus, onblur) {
    return $('<td><input class="ui-autocomplete-input form-control mandatory" style="width:' + width + ';" placeholder="' + placeholder + '" type="text" id="' + id + '" onfocus="' + onfocus + '" onblur="' + onblur + '" autocomplete="off" role="textbox"></td>');
}

function DisplayTransaction() {
    
    var Summary = document.getElementById('Summary');
    Summary.style.display = 'none';
    $("#receiptTransactionTableBody ").html("");
    var iTransDtId = 0;
    //var li = $('<tr  id=' + iTransDtId + '><td><input style="height: 12px; width:12px;" type="checkbox" id=' + iTransDtId + '></td><td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')" ></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px; "></i></span></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="TradeNo"  type="text" id="iTag1_' + iTransDtId + '" onfocus=DataLoadCall("#iTag1_' + iTransDtId + '","GetTags","",1,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag1_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag1_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory" placeholder="Division"  style="width:150px;"  type="text" id="iTag2_' + iTransDtId + '" onfocus=DataLoadCall("#iTag2_' + iTransDtId + '","GetTags","",2,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag2_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag2_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="CostCentre"  type="text" id="iTag4_' + iTransDtId + '" onfocus=DataLoadCall("#iTag4_' + iTransDtId + '","GetTags","",4,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag4_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag4_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory"  style="width:200px;" placeholder="Project"  type="text" id="iTag5_' + iTransDtId + '" onfocus=DataLoadCall("#iTag5_' + iTransDtId + '","GetTags","",5,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag5_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag5_' + iTransDtId + '-code"/></td>   <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="BusinessUnit"  type="text" id="iTag6_' + iTransDtId + '" onfocus=DataLoadCall("#iTag6_' + iTransDtId + '","GetTags","",6,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag6_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag6_' + iTransDtId + '-code"/></td> <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="Location"  type="text" id="iTag7_' + iTransDtId + '" onfocus=DataLoadCall("#iTag7_' + iTransDtId + '","GetTags","",7,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag7_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag7_' + iTransDtId + '-code"/></td>  <td><input class="ui-autocomplete-input form-control mandatory"  style="width:150px;" placeholder="SubTrade"  type="text" id="iTag8_' + iTransDtId + '"  onfocus=DataLoadCall("#iTag8_' + iTransDtId + '","GetTags","",8,"Tags") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="iTag8_' + iTransDtId + '-id" /><input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="iTag8_' + iTransDtId + '-code"/></td><td><input class="ui-autocomplete-input form-control mandatory" placeholder="Account"  style="width:250px;"  type="text" id="CreditAccount_' + iTransDtId + '" onfocus=DataloadMaster_AccountType("#CreditAccount_' + iTransDtId + '","GetAccount",1,2) autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="CreditAccount_' + iTransDtId + '-id" onchange="clearReferenceOnAccountChange(' + iTransDtId + ')" /> <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-itype"/>    <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="CreditAccount_' + iTransDtId + '-code"/> </td> <td><input style="width:250px;" class="ui-autocomplete-input form-control mandatory" placeholder="Amount" type="text" id="Amount_' + iTransDtId + '" autocomplete="off" onblur="setFooterdata()" onkeypress="addRow(' + iTransDtId + ')" role="textbox"> </td><td> <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Reference" type="text" id="Reference_' + iTransDtId + '"  onfocus="fQtyReferencePopup(' + iTransDtId + ')" autocomplete="off" role="textbox"></td><td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="Remarks" type="text" id="Remarks_' + iTransDtId + '" autocomplete="off" role="textbox"></td> <td> <input class="ui-autocomplete-input form-control" placeholder="TaxCode"  style="width:250px;"  type="text" id="TaxCode_' + iTransDtId + '" onfocus=DataLoadCall("#TaxCode_' + iTransDtId + '","GetTaxCode","",0,"TaxCode") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true"><input type="hidden" id="TaxCode_' + iTransDtId + '-id"  />     <input type="hidden" style="border: transparent;background-color: transparent;"  readonly="readonly" id="TaxCode_' + iTransDtId + '-code"/>     </td> <td><input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="VAT" type="text" id="Vat_' + iTransDtId + '" autocomplete="off" role="textbox" onblur="roundingInputVariables(event, ' + iTransDtId +')"></td> <td>  <input style="width:250px;" class="ui-autocomplete-input form-control" placeholder="RelatedParty" type="text" id="RelatedParty_' + iTransDtId + '" onfocus=DataLoadCall("#RelatedParty_' + iTransDtId + '","GetRelatedParty","",0,"RelatedParty") autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true">  <input type="hidden" id="RelatedParty_' + iTransDtId + '-id" onchange="" value="0" /> </td>  ');
    //li.appendTo($("#receiptTransactionTableBody"));



    var iTransDtId = 0;
    var tableBody = $("#receiptTransactionTableBody");

    // Create the table row element
    var row = $('<tr id="' + iTransDtId + '"></tr>');   

    // Create the table cells
    var checkboxCell = $('<td><input style="height: 12px; width: 12px;" type="checkbox" id="' + iTransDtId + '"></td>');
    var commentCell = $('<td class="CellWithComment"><span class="CellComment"><i class="zmdi zmdi-plus" onclick="addLine(' + iTransDtId + ')"></i><i class="zmdi zmdi-delete" onclick="deleteLine(' + iTransDtId + ')" style="padding: 0px 5px;"></i></span></td>');

    var tradeNoCell = createTableCell("TradeNo", "150px", "iTag1_" + iTransDtId, 'DataLoadCall("#iTag1_' + iTransDtId + '","GetTags","",1,"Tags")', 'setFooterdata()');
    var divisionCell = createTableCell("Division", "150px", "iTag2_" + iTransDtId, 'DataLoadCall("#iTag2_' + iTransDtId + '","GetTags","",2,"Tags")', 'setFooterdata()');
    var costCentreCell = createTableCell("CostCentre", "200px", "iTag4_" + iTransDtId, 'DataLoadCall("#iTag4_' + iTransDtId + '","GetTags","",4,"Tags")', 'setFooterdata()');
    var projectCell = createTableCell("Project", "200px", "iTag5_" + iTransDtId, 'DataLoadCall("#iTag5_' + iTransDtId + '","GetTags","",5,"Tags")', 'setFooterdata()');
    var businessUnitCell = createTableCell("BusinessUnit", "150px", "iTag6_" + iTransDtId, 'DataLoadCall("#iTag6_' + iTransDtId + '","GetTags","",6,"Tags")', 'setFooterdata()');
    var locationCell = createTableCell("Location", "150px", "iTag7_" + iTransDtId, 'DataLoadCall("#iTag7_' + iTransDtId + '","GetTags","",7,"Tags")', 'setFooterdata()');
    var subTradeCell = createTableCell("SubTrade", "150px", "iTag8_" + iTransDtId, 'DataLoadCall("#iTag8_' + iTransDtId + '","GetTags","",8,"Tags")', 'setFooterdata()');
    var creditAccountCell = createTableCell("Account", "250px", "CreditAccount_" + iTransDtId, 'DataloadMaster_AccountType("#CreditAccount_' + iTransDtId + '","GetAccount",1,2)', 'clearReferenceOnAccountChange(' + iTransDtId + ')');
    var amountCell = createTableCell("Amount", "250px", "Amount_" + iTransDtId, 'setFooterdata()', 'addRow(' + iTransDtId + ')');
    var referenceCell = createTableCell("Reference", "250px", "Reference_" + iTransDtId, 'fQtyReferencePopup(' + iTransDtId + ')');
    var remarksCell = createTableCell("Remarks", "250px", "Remarks_" + iTransDtId);
    var taxCodeCell = createTableCell("TaxCode", "250px", "TaxCode_" + iTransDtId, 'DataLoadCall("#TaxCode_' + iTransDtId + '","GetTaxCode","",0,"TaxCode")', 'setFooterdata()');
    var vatCell = createTableCell("VAT", "250px", "Vat_" + iTransDtId, '', 'roundingInputVariables(event, ' + iTransDtId + ')');
    var relatedPartyCell = createTableCell("RelatedParty", "250px", "RelatedParty_" + iTransDtId, 'DataLoadCall("#RelatedParty_' + iTransDtId + '","GetRelatedParty","",0,"RelatedParty")', '');

    // Append the cells to the row
    row.append(checkboxCell, commentCell, tradeNoCell, divisionCell, costCentreCell, projectCell, businessUnitCell, locationCell, subTradeCell, creditAccountCell, amountCell, referenceCell, remarksCell, taxCodeCell, vatCell, relatedPartyCell);

    // Append the row to the table body
    row.appendTo(tableBody);




    var Transaction = document.getElementById('Transaction');
    Transaction.style.display = 'block';
    //document.getElementById("MenuBtns").children[1].style.display = "none";
    //document.getElementById("MenuBtns").children[2].style.display = "block";
    ////document.getElementById("MenuBtns").children[4].style.display = "block";
    //document.getElementById("MenuBtns").children[5].style.display = "block";
    //document.getElementById("MenuBtns").children[6].style.display = "block";



    document.getElementById("MenuBtns").children[1].style.display = "none";
    document.getElementById("MenuBtns").children[2].style.display = "block";
    document.getElementById("MenuBtns").children[3].style.display = "block";//PostPrint    
    document.getElementById("MenuBtns").children[5].style.display = "block";
    document.getElementById("MenuBtns").children[6].style.display = "block";
    document.getElementById("MenuBtns").children[7].style.display = "block";

    document.getElementById("totalAmount").innerHTML = "";
    $("#btnDelete").prop("disabled", false);//disabled during istatus=0 in edit
    $('#tbltransAttachbody').html("");
    
        $("#btnPost").prop("disabled", false);
        $("#btnPostPrint").prop("disabled", false);
    
    _BillWiseReferenceEdit = [];
    referenceData_load = [];
    //document.getElementById('Tab0').style.display = 'active';
    //$("#Tab0").attr("active");
    $("#lblUploadError").text("");
    $("#file").val('');
   
}

function DisplaySummary() {
    var Summary = document.getElementById('Summary');
    Summary.style.display = 'block';
    var Transaction = document.getElementById('Transaction');
    Transaction.style.display = 'none';
    //document.getElementById("MenuBtns").children[2].style.display = "none";
    //document.getElementById("MenuBtns").children[3].style.display = "none";
    ////document.getElementById("MenuBtns").children[4].style.display = "block";
    //document.getElementById("MenuBtns").children[1].style.display = "block";
    //document.getElementById("MenuBtns").children[5].style.display = "none";
    //document.getElementById("MenuBtns").children[6].style.display = "none";

    document.getElementById("MenuBtns").children[2].style.display = "none";
    document.getElementById("MenuBtns").children[3].style.display = "none"; //PostPrint
    document.getElementById("MenuBtns").children[4].style.display = "none"; //Print
    document.getElementById("MenuBtns").children[1].style.display = "block";
    document.getElementById("MenuBtns").children[5].style.display = "none";
    document.getElementById("MenuBtns").children[6].style.display = "none";
    document.getElementById("MenuBtns").children[7].style.display = "none";

    $("#btnDelete").prop("disabled", false);//disabled during istatus=0 in edit
    table.ajax.reload();
   // alert(document.getElementById("MenuBtns").children[4].innerHTML);
}
    //alert("summary");
    var table = $('#receiptSummaryTable').DataTable({

        //"sAjaxSource": "/Ducon/OutletsummaryDataTable",
        "sAjaxSource": "/FocusMaxTransaction/ReceiptSummaryDataTable",
        "fnServerParams": function (aoData) {          
                aoData.push({ "name": "userId", "value": userid }, { "name": "sApiName", "value": "ReceiptSummary" });            
        },

        "initComplete": function (settings, json) {
            $("#receiptSummaryTable").wrap("<div style='overflow:auto; width:100%;max-height:350px; position:relative;'></div>"); //total table length
        },
        "bServerSide": true,
        "bProcessing": true,
        "bSearchable": true,
        "autoWidth": true,
        "order": false,
        "orderable": false,
        "className": 'letter',
        "scrollY": true,
        'width': '100%',
        "language": {
            "emptyTable": "No record found.",
            "processing": "Loading..."
            //'<i class="fa fa-spinner fa-spin fa-3x fa-fw" style="color:#2a2b2b;"></i><span class="sr-only">Loading...</span> '


        },
        "columns": [
            {
                'width': 10,
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'autoWidth': false,
                'render': function (data, type, full, meta) {

                    return '<input type="checkbox" name="id[]" value="'
                        + $('<div/>').text(data).html() + '">';
                }
            },
            {
                "data": "sDocDate",
                "autoWidth": true,
                'orderable': false,
                "searchable": true
            },
            {
                "data": "sDocNo",
                "autoWidth": true,
                'orderable': false,
                "searchable": true
            },
            {
                "data": "sCompany",
                "autoWidth": true,
                'orderable': false,
                "searchable": true
            },
            {
                "data": "sNarration",
                "autoWidth": true,
                'orderable': false,
                "searchable": true
            }, 
            
        ],
        


    });

   
   

//}

$('#receiptSummaryTable').on('draw.dt', function () {
    mainTableList = [];
})

$("#receiptSummaryTable").on('change', 'input[type=checkbox]', function (event) {
    var $row = $(this).closest('tr');
    var data = table.rows($row).data();
    // alert("data" + JSON.stringify(data));
    var rowId = data[0];
    //alert("rowId" + JSON.stringify(rowId));
    var index = $.inArray(rowId, mainTableList);
    if (this.checked && index === -1) {
        mainTableList.push(rowId);
        //  $("#hdn_iTransId").val(mainTableList[0].iId);
        //  alert("hdn_iTransId" + $("#hdn_iTransId").val());
    }
    else if (!this.checked && index !== -1) {
        mainTableList.splice(index, 1);
    }

    // alert("receiptSummaryTable" + JSON.stringify(mainTableList));
});

$('#btnEdit').on('click', function () {
    // $("#transactionTableBody").html("");    
    //$("#tbltransAttachbody").html("");
    //$("#transactionTable thead").remove();
    //$("#transactionTable tr").remove();
    if (mainTableList.length > 0) {
        // var id = $('#headBreadCrumb li').last().children('a').attr('id');
        enableMainTab();
        DisplayTransaction();
        //alert("mainTableList" + JSON.stringify(mainTableList));
        var chkId = mainTableList[0].iTransId;
        //alert("chkId" + JSON.stringify(chkId));
        $("#hdn_iTransID").val(chkId);
        type = 2;
        loadReceipt(type);
        
        //runConfirmTrans("/Trans/ApproveTrans?iTrans=" + chkId + "&iEvent=" + iAction + "&iType=" + iType + "", "/Trans/TransSummary/" + id + "", "Approve");

    }
    else {
        runError("Please select any row");
    }

});



$(document).on('dblclick', '#receiptSummaryTable tbody tr', function () {
    if (userid == 0) {
        window.location = "/Main/LogOut";
    }
    else {
        var row = $(this).closest('tr');
        var data = $('#receiptSummaryTable').dataTable().fnGetData(row);       
        var chkId = data.iTransId;
        //mainTableList.push(data);
        $("#hdn_iTransID").val(chkId);
       // alert("hdn_iTransID " + $("#hdn_iTransID").val())
       // alert("hdn_iTransID" + $("#hdn_iTransID").val())
       // alert("data" + JSON.stringify(data));
        type = 2;
        $("#Company").prop("disabled", true);
        enableMainTab();
        clearHeaderFields();
        DisplayTransaction();
        loadReceipt(type);
    }


});

$("#btnPrev").on('click', function () {
    //alert("Prev hdn_iTransID" + $("#hdn_iTransID").val() + "ivouchertype" + $("#hdn_iVoucherType").val());
    //$("#GetBillWiseReference").hide();
    GetPrevNext_DocNo($("#hdn_iVoucherType").val(), $("#hdn_iTransID").val(), 1);

});

$("#btnNext").on('click', function () {
    //alert("Next hdn_iTransID" + $("#hdn_iTransID").val());
    //$("#GetBillWiseReference").hide();
    GetPrevNext_DocNo($("#hdn_iVoucherType").val(), $("#hdn_iTransID").val(), 2);

});


function GetPrevNext_DocNo(iVoucherType, iTransID, iType) {
    //iType=1 Prev
    //iType=2 Next
    enableMainTab();
    $.ajax({
        url: "/FocusMaxTransaction/GetPrevNext_DocNo",
        data: { sApiName: "GetPrevNext_DocNo", sFParameter: "iDoctype", sFParameterValue: iVoucherType, sSParameter: "iTransId", sSParameterValue: $("#hdn_iTransID").val(), sTParameter: "iType", sTParameterValue: iType },
        success: function (data, res) {

            data = JSON.parse(data);
            data = data.ResultData;
            // alert("1."+data)
            data = JSON.parse(data);
            //alert("data" + JSON.stringify(data))//sDocNo  "iTransId

            if (data.length > 0) {
                
               // $("#btnPost").prop("disabled", true);
                console.log("GetPrevNext_DocNo ");
                console.log("sDocNo "+data[0].sDocNo)
                console.log("iTransId "+data[0].iTransId)
                DisplayTransaction();
                $("#hdn_iTransID").val(data[0].iTransId)
                type = 2;
                loadReceipt(type);
            }
            else {
                runError("End of List");
            }


        }
    });


}

//onclick = "fQtyReferencePopup(' + iTransDtId + ')"
function roundingInputVariables(evt, i) {
    var sColId;
    if (evt != 0) {
        sColId = evt.srcElement.id;
    }
   // alert("roundingInputVariables" + sColId);
    if (sColId == "Vat_" + i) {
        var vat = $("#Vat_" + i).val();
        if (vat == "") {
            vat = 0
        } else {
            vat = parseFloat($("#Vat_" + i).val()).toFixed(fDecFixAmount);
        }
        vat = parseFloat(vat);
        $("#Vat_" + i).val(vat);
    }
    
}

//function fQtyBatchPopup(id) {
function fQtyReferencePopup(id) {

    var qtyFillFlag = 1;
    //var sOutlet = $("#OutletSelect" + id).val();
    //var iOutlet = $("#OutletSelect" + id + "-id").val();
    //var fAmount = $("#t_fAmount" + id).val(); //here no iunit (i.e iId=0) and exists only sUnit
    //alert("id " + id + "product " + product + " iproduct " + iproduct + "iunit" + iunit);
    //if ((iOutlet != 0) && (fAmount != "")) {//req
        // let dm = new DataManipulation();
        //alert("id" + id);
        $("#hdn_rowId").val(id);
        //$("#hdn_qtyType").val(qtyType);
        // $("#GetMasterListfQtyBatch").show();
        //$("#tBatchAlloc_Qty").val("");
        //$("#tBatchBalQty").val("");
        $('#errLblBalQtyCheck').text("");
        $("#tBatchAlloc_Qty").val(0);
        $("#StBatchAlloc_Qty").text(0);
       
        var fQty = "";     
    fQty = applyExchngRateToAmt(id);
    //console.log("fQty~~ " + fQty);
   // $("#Amount_" + id).val(parseFloat(fQty));
    //console.log("fQty" + fQty);
    if ($("#CreditAccount_" + id + "-id").val() == 0) {

        runError("Please Fill Account");
        qtyFillFlag = 0;
    }
   
    else if ($("#Amount_" + id).val()<= 0 ) {
            runError("Please Fill Amount");
            qtyFillFlag = 0;
        }
      
        if (qtyFillFlag == 1) {
            $("#tBatchQty").val(fQty);
            $("#StBatchQty").text(fQty);
            $("#tBatchBalQty").val(fQty);            
            $("#StBatchBalQty").text(fQty);
           // alert("StBatchBalQty" + $("#StBatchBalQty").text())
            $("#tUnAllocated").val("");
           
            $.ajax({
                url: "/FocusMaxTransaction/GetInvoiceList",
               // data: { sApiName: 'GetBillAdjustDetails', sParamOne: "iDoctype", iParamOneVal: $("#hdn_iVoucherType").val(), sParamTwo: "iAccount", sParamTwoVal: $("#Bank-id").val() },
                //data: { sApiName: 'PendingDetails', sParamOne: "iCompany", iParamOneVal: $("#Company-id").val(), sParamTwo: "iAccount", sParamTwoVal: $("#CreditAccount_" + id + "-id").val(), sParamThree: "iTransId", sParamThreeVal: "", sParamFour: "iDoctype", sParamFourVal: $("#CreditAccount_" + id + "-id").val() },
                data: { sApiName: 'PendingDetails', sParamOne: "iCompany", iParamOneVal: $("#Company-id").val(), sParamTwo: "iAccount", sParamTwoVal: $("#CreditAccount_" + id + "-id").val(), sParamThree: "iTransId", sParamThreeVal: $("#hdn_iTransID").val(), sParamFour: "iDoctype", sParamFourVal: iVoucherType },
                success: function (data, res) {
                    referenceData = [];
                    //alert("referenceData 1" + JSON.stringify(data.record));
                    referenceData = data.record.table;
                   
                   // if (referenceData != false) {
                        //BuildPopUp(data);
                        BuildPopUp(referenceData);
                   //}
                    //else {
                    //    //runError("Reference List is empty");
                    //    var li = $('<div class="col-lg-12" id="ViewsEntitydatas" style="overflow:auto; width:100%;max-height:480px;">');
                    //    li.appendTo($("#binddata"));
                    //    var li = $('<ul class="col-lg-12" style="margin-top:7px;position: absolute;left:300px" id="ul_No2"><li id="li_No2" style="height:15px;list-style-type:none;display:block;padding:0px;"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 18px;padding-left:5px;">List is empty</label></li></ul>');
                    //    li.appendTo($("#binddata"));
                    //}
                }
            });
        }

    //}
    //else {//req
    //    runError("pls fill outlet,amount");
    //}

}

function BuildPopUp(data) {

    var _data = [];
   // _data = data.record; //.table   
   // data = JSON.parse(data);
  //  data = data.ResultData;
    // alert("1."+ data)
    _data = data;
    var tb_rowID = $("#hdn_rowId").val();

    ///////////////////////////////////////////////////////////////////////////////////////
    //-----------------------| Same Account in multiple rows |---------------------------//
    ///////////////////////////////////////////////////////////////////////////////////////
    var iAccount = $("#CreditAccount_" + tb_rowID + "-id").val();
    // var iUnit = $("#UnitSelect" + tb_rowID).val();
    var GfQty = 0;//typing qty
    var freeQtyExistFlg = 0;
    var enteredBatchQty = 0;

    var result = 0;
    $("#binddata").html("");
   // console.log("tb_rowID: " + JSON.stringify(tb_rowID));
   // alert("mult1: " + JSON.stringify(_data));
   // for (var batch = 0; batch < _data.length; batch++) {    
    
    var unallocatedAmount = 0;
    var referenceData_loadFiltered_UnAllocted = referenceData_load.filter(x => (x.iRow == tb_rowID))
   
    if (referenceData_loadFiltered_UnAllocted.length > 0) {
        referenceData_loadFiltered_UnAllocted = referenceData_load.filter(x => (x.iRow == tb_rowID) && (x.iRefType == 2))
        if (referenceData_loadFiltered_UnAllocted.length > 0) {

            unallocatedAmount = referenceData_loadFiltered_UnAllocted[0].fQty;
            $("#tUnAllocated").val(unallocatedAmount);
            console.log("unallocatedAmount: " + unallocatedAmount);

        }
        else {
            $("#tUnAllocated").val("");
        }
    }
       
    var bAmount = 0;
    for (var batch = 0; batch < _data.length; batch++) {
       // alert("_data[batch].refId: " + _data[batch].refId + "iOutlet " + iOutlet + " iTransId" + _data[batch].refId);
        // alert("mult1: " + _data.length + "prodid" + $("#ProductSelect" + tb_rowID + "-id").val() + "iunit" + $("#UnitSelect" + tb_rowID + "-id").val() + "sBatch" + _data[batch].sBatch);
        var referenceData_loadFiltered_prod = referenceData_load.filter(x => (x.iAccount == iAccount) && (x.iRef == _data[batch].refId) ); //(x.iUnit == iUnit) &&
       // alert("referenceData_loadFiltered_prod" + JSON.stringify(referenceData_loadFiltered_prod));
        if (referenceData_loadFiltered_prod.length > 0) {
            //alert("mult2: " + referenceData_loadFiltered_prod.length);
            GfQty = 0;
            for (var a = 0; a < referenceData_loadFiltered_prod.length; a++) {
                freeQtyExistFlg = 0;
                enteredBatchQty = 0;
                batchCreatedFlg = 0;
                GfQty += parseFloat(referenceData_loadFiltered_prod[a].fQty);
                // result = (parseFloat(referenceData_loadFiltered_prod[a].fBQty) - GfQty);
                bAmount = parseFloat(_data[batch].billAmount)
                console.log("bfr Math.abs bAmount " + bAmount)
                bAmount = Math.abs(bAmount);
                console.log("aftr Math.abs bAmount " + bAmount)
                result = (parseFloat(bAmount) - GfQty);
                // alert("B4 edit fBQty: " + parseFloat(_data[batch].fQty) + " GfQty " + GfQty + " result " + result)
                // alert(" tb_rowID " + tb_rowID + " bFoc " + bFoc);
                console.log(" tb_rowID " + tb_rowID );
                //Edit Mode Before Insert
                var referenceData_loadEditMode = referenceData_loadFiltered_prod.filter(x => (x.iRow == tb_rowID)); //bFoc  //&& (x.bFoc == bFoc)
                if (referenceData_loadEditMode.length > 0) {                                        
                    freeQtyExistFlg = 1;
                    batchCreatedFlg = 1;

                    //if (referenceData_loadEditMode[0].iRefType == 2) {
                    //    unallocatedAmount=referenceData_loadEditMode[0].fQty
                    //}
                    //result = (parseFloat(referenceData_loadFiltered_prod[a].fBQty) - GfQty) + parseFloat(referenceData_loadEditMode[0].fQty);
                    //result = (parseFloat(_data[batch].fAmount) - GfQty) + parseFloat(referenceData_loadEditMode[0].fQty); //0
                    bAmount = parseFloat(_data[batch].billAmount)
                    bAmount = Math.abs(bAmount);
                    result = (parseFloat(bAmount) - GfQty) + parseFloat(referenceData_loadEditMode[0].fQty); //0
                    enteredBatchQty = parseFloat(referenceData_loadEditMode[0].fQty);
                    //alert("in edit fBQty: " + parseFloat(_data[batch].fQty) + " GfQty " + GfQty + " fQty " + parseFloat(referenceData_loadEditMode[0].fQty) + " batch " + referenceData_loadFiltered_prod[a].sBatch + " result " + result + "bFoc " + bFoc)

                }

                //_data[batch].fQty = result;
                if (referenceData_loadFiltered_prod.length == (a + 1)) {
                    if (freeQtyExistFlg == 1) {
                        console.log("freeQtyExistFlg yes" + result);
                        //alert("call .. createBatch res" + result + " enteredBatchQty  " + enteredBatchQty);
                        //referenceData_loadEditMode[0].fQty
                        createReference(_data, batch, result, enteredBatchQty, unallocatedAmount);//wholebatch, batch position, wholebatch balance value,entered value
                    }
                    else {
                        //alert("freeQtyExistFlg no");
                        createReference(_data, batch, result, 0, 0);
                    }
                }

            }
        }
        else {
           
            bAmount = parseFloat(_data[batch].billAmount)
            console.log("freeQty-- else 1." + bAmount);
            bAmount = Math.abs(bAmount);
            console.log("freeQty-- else 2." + bAmount);
           // createReference(_data, batch, parseFloat(_data[batch].fAmount), 0); //wholebatch, batch position, wholebatch value,entered value
            createReference(_data, batch, parseFloat(bAmount), 0, unallocatedAmount); //wholebatch, batch position, wholebatch value,entered value
        }

    }
    var tableLen = document.getElementById("binddata").rows.length;
    if (tableLen > 0) {
        $("#GetMasterListfQtyBatch").show();
    }
    else {
        //$("#GetMasterListfQtyBatch").hide();
        //runError("Batch is empty ");
        $("#GetMasterListfQtyBatch").show();
        var li = $('<div class="col-lg-12" id="ViewsEntitydatas" style="overflow:auto; width:100%;max-height:480px;">');
        li.appendTo($("#binddata"));
        var li = $('<ul class="col-lg-12" style="margin-top:7px;position: absolute;left:300px" id="ul_No2"><li id="li_No2" style="height:15px;list-style-type:none;display:block;padding:0px;"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 18px;padding-left:5px;">List is empty</label></li></ul>');
        li.appendTo($("#binddata"));
        calcValues_PopUpBillWiseRef_Edit();
        //runError("Batch is empty ");
    }

}
function createReference(_data, id, batchBalQty, allocatedQty) {
    if (allocatedQty == 0)
        allocatedQty = "";
    //console.log("allocatedQty" + allocatedQty);
    console.log("batchBalQty" + batchBalQty);
    //if (parseFloat(batchBalQty) > 0) {                                                                                                                                                                                                           //_data[id].fQty                                                                                 //reqQty
    var _batchBalQty = rounding(batchBalQty);
    if (parseFloat(_batchBalQty) > 0) {
       // var _batchBalQty = batchBalQty;
        console.log("_batchBalQty" + _batchBalQty);
        /*<td id="tdCurrency' + id + '">' + _data[id].currency + ' <input type="hidden" id="hdn_iCurrency' + id + '" value="' + _data[id].iCurrency + '">  </td>*/
        var li = $('<tr  id=' + id + ' >    <td id="tdsBatch' + id + '"> ' + _data[id].focusDoc + ' <input type="hidden" id="hdn_iRef' + id + '" value="' + _data[id].refId + '"></td><td id="tdexpDate' + id + '">' + _data[id].docDate + '</td> <td id="tdBalQty' + id + '" style="text-align: right;">' + _batchBalQty + ' <input type="hidden" id="hdn_tdBalQty' + id + '" value="' + batchBalQty + '">   </td> <td><input type="text"  class="form-control" id="t_ReqQty' + id + '" value="' + allocatedQty + '" autofocus  min="0"   autocomplete="off" onblur="AvailableQtyCheck(' + id + ')"  /></td></tr>');
        li.appendTo($("#binddata"));
        //if (batchCreatedFlg == 1)
        { //Here Edit Mode i.e bfr insert ; values shld be displayed in allocated and bal textbox in popup
            calcValues_PopUpBillWiseRef_Edit();
        }
    }
    //}
}
function clearReference(tb_rowID) { // OnOutletChange and OnBatchChange
    var referenceData_loadFiltered = [];
    //if (bFoc == -1) { //OnProductChange and OnRowDelete both qty and fqty batch arrays should get cleared.

    referenceData_loadFiltered = referenceData_load.filter(x => (x.iRow == tb_rowID));//&& (x.iProduct == iProduct)
    if (referenceData_loadFiltered.length > 0) {
        referenceData_load.splice(referenceData_load.findIndex(x => (x.iRow == tb_rowID)), referenceData_loadFiltered.length);
    }
    //if (check == 1) {
    //    $("#UnitSelect" + tb_rowID).val("");
    //    $("#fQty" + tb_rowID).val("");
    //    $("#t_fQtyBatch" + tb_rowID).val("");
    //}

    // }
    //else { //OnBatchChange i.e minus variance
    //    referenceData_loadFiltered = referenceData_load.filter(x => (x.iRow == tb_rowID) && (x.iProduct == iProduct)); //&& (x.bFoc == bFoc)
    //    if (referenceData_loadFiltered.length > 0) {
    //        referenceData_load.splice(referenceData_load.findIndex(x => (x.iRow == tb_rowID) && (x.iProduct == iProduct)), referenceData_loadFiltered.length); //&& (x.bFoc == bFoc)
    //    }
    //}
    //  alert("Batch Remaining...." + JSON.stringify(referenceData_load));   
}
function clearReferenceOnAccountChange(tb_rowID) {
    clearReference(tb_rowID);
    $("#Reference_" + tb_rowID).val("");  
    if ($("#CreditAccount_" + tb_rowID + "-itype").val() == 3) {        
        $("#Reference_" + tb_rowID).prop("disabled", false);       
    }
    else {
        $("#Reference_" + tb_rowID).prop("disabled", true);
    } 
}

function rounding(values) {
    //return $.ajax({
    //    url: "/FocusMaxTransaction/CommaFormattedDecimalRounded",
    //    data: { strDecimal: values, RoundPlaces:2 },//2
    //    async: !1,
    //    success: function (data, res) {
    //        return data;
    //    }
    //});
    values = parseFloat(values).toFixed(fDecFixAmount);
    var str = values.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
}



//function calcValues_PopUpBatch() {
function calcValues_PopUpBillWiseRef() {
    var totalAllQty = 0;
    //var totalQty = parseFloat($('#tBatchQty').val()); //=hdnDoc_iUnAllocatedAmt of PV
    //var totalQty = parseFloat($('#hdnDoc_iUnAllocatedAmt').val());//here
    var iTb_rowID = $("#hdn_rowId").val()
    var iRefRowId = $('#hdn_iRefRowID').val();
 

    //parseFloat($('#tBatchAlloc_Qty').val()) - _fQty
    //totalQty += reqfQty;
   // alert("totalQty in calcValues_PopUpBillWiseRef " + totalQty)
   // alert("referenceData" + referenceData.length)

     // var totalQty = parseFloat($("#Amount_" + iTblrowIndex).val());
    //if (referenceData.length > 0)//
    { //.table
        //var fUnallocatedAmt = 0;
        //if ($('#tUnAllocated').val() != "") {
        //    fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
        //}
        totalAllQty = 0;
        for (i = 0; i < referenceData.length; i++) { //.table
            //alert("t_ReqQty"+$('#t_ReqQty' + i).val());
            if (parseFloat($('#t_ReqQty' + i).val()) > 0) {
                totalAllQty += parseFloat($('#t_ReqQty' + i).val());
            }
        }
        var fUnallocatedAmt = 0;
        if ($('#tUnAllocated').val() != "") {
            fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
        }
        // var _fQty = parseFloat($('#hdn_tdBalQty' + iRefRowId).val());//_referenceData[i].fQty
        //if ($('#t_ReqQty' + iRefRowId).val() == "") {
        //    $('#t_ReqQty' + iRefRowId).val(0);
        //}
        //var reqfQty = parseFloat($('#t_ReqQty' + iRefRowId).val());
        var totnetAmt = applyExchngRateToAmt(iTb_rowID);
        // var totalQty = totnetAmt 
        //alert("totalQty " + totalQty)
        //if (totalQty >= totalAllQty)
        {
            var sumTot = fUnallocatedAmt + parseFloat(totalAllQty);
            // var totalQty = totnetAmt - (fUnallocatedAmt + parseFloat(totalAllQty));////take cr
            var totalQty = totnetAmt - (sumTot);
            if (totnetAmt >= sumTot) {
                $('#tBatchBalQty').val(totalQty); //.toFixed(fDecFix)
                $('#StBatchBalQty').text($('#tBatchBalQty').val());

                $('#tBatchAlloc_Qty').val(sumTot); //.toFixed(fDecFix)
                $('#StBatchAlloc_Qty').text(sumTot); //.toFixed(fDecFix)

                // var _totalQty = parseFloat($("#tBatchQty").val());
                // $('#lNewRefBalAmountValue').text(totalQty - totalAllcQty);//tBatchBalQty
                //  $('#tBatchBalQty').text(_totalQty - totalAllQty);//tBatchBalQty //here 23
                //  $('#tBatchAlloc_Qty').text(totalAllQty); //tBatchAlloc_Qty //here 23
                if ($('#tBatchBalQty').val() == 0) {
                    // $('#tUnAllocated').val(0);

                }
                //console.log("calcValues_PopUpBillWiseRef Bal : " + $('#tBatchBalQty').val())

                return true;
            }
            else {
                return false;
            }
        }
        //else {
        //    return false;
        //}

    }
    
}
function calcValues_PopUpBillWiseRef_Edit() {
    var totalAllQty = 0;
    //var totalQty = parseFloat($('#tBatchQty').val()); //=hdnDoc_iUnAllocatedAmt of PV
    //var totalQty = parseFloat($('#hdnDoc_iUnAllocatedAmt').val());//here
    var iTb_rowID = $("#hdn_rowId").val()
    var iRefRowId = $('#hdn_iRefRowID').val();  
    //if (referenceData.length > 0)
    { //.table
        //var fUnallocatedAmt = 0;
        //if ($('#tUnAllocated').val() != "") {
        //    fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
        //}
        totalAllQty = 0;
        for (i = 0; i < referenceData.length; i++) { //.table
            //alert("t_ReqQty"+$('#t_ReqQty' + i).val());
            if (parseFloat($('#t_ReqQty' + i).val()) > 0) {
                totalAllQty += parseFloat($('#t_ReqQty' + i).val());
            }
        }
        var fUnallocatedAmt = 0;
        if ($('#tUnAllocated').val() != "") {
            fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
        }
        // var _fQty = parseFloat($('#hdn_tdBalQty' + iRefRowId).val());//_referenceData[i].fQty
        //if ($('#t_ReqQty' + iRefRowId).val() == "") {
        //    $('#t_ReqQty' + iRefRowId).val(0);
        //}
        //var reqfQty = parseFloat($('#t_ReqQty' + iRefRowId).val());
        var totnetAmt = applyExchngRateToAmt(iTb_rowID);
        // var totalQty = totnetAmt 
        //alert("totalQty " + totalQty)
        //if (totalQty >= totalAllQty)
        {
            var sumTot = fUnallocatedAmt + parseFloat(totalAllQty);
            var totalQty = totnetAmt - sumTot;////take cr
           //console.log("totalQty ok " + totalQty)
           // alert("sumTot " + sumTot)
            //if (totnetAmt >= sumTot) 
            {
                $('#tBatchBalQty').val(totalQty); //.toFixed(fDecFix)
                $('#StBatchBalQty').text($('#tBatchBalQty').val());

                $('#tBatchAlloc_Qty').val(sumTot); //.toFixed(fDecFix)
                $('#StBatchAlloc_Qty').text(sumTot); //.toFixed(fDecFix)


                // var _totalQty = parseFloat($("#tBatchQty").val());
                // $('#lNewRefBalAmountValue').text(totalQty - totalAllcQty);//tBatchBalQty
                //  $('#tBatchBalQty').text(_totalQty - totalAllQty);//tBatchBalQty //here 23
                //  $('#tBatchAlloc_Qty').text(totalAllQty); //tBatchAlloc_Qty //here 23
                if ($('#tBatchBalQty').val() == 0) {
                    // $('#tUnAllocated').val(0);

                }
                console.log("calcValues_PopUpBillWiseRef Bal : " + $('#tBatchBalQty').val())

                
            }
            
        }
       

    }
}




function AvailableQtyCheck(index) {
   // alert("AvailableQtyCheck");
    var flag = true;
    var tot_ReqQty = 0;
   // var tQty = parseFloat($("#tBatchQty").val());
   // var tQty = parseFloat($("#hdnDoc_iUnAllocatedAmt").val());
    $('#hdn_iRefRowID').val(index);
    var iTblrowIndex = $("#hdn_rowId").val();
    //var tQty = parseFloat($("#Amount_" + iTblrowIndex).val());
    //var tQty = parseFloat($("#Amount_" + iTblrowIndex).val());
    var fUnallocatedAmt = 0;
    if ($('#tUnAllocated').val() != "") {
        fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
    }
    var iTb_rowID = $("#hdn_rowId").val();
    var totnetAmt = applyExchngRateToAmt(iTb_rowID);
    
    var tQty = totnetAmt - ( parseFloat($('#tBatchAlloc_Qty').val()));
    if ($('#t_ReqQty' + index).val() == "") {
        $('#t_ReqQty' + index).val(0);
    }
    var reqfQty = parseFloat($('#t_ReqQty' + index).val());
    tQty += reqfQty;
    var rQty = $("#t_ReqQty" + index).val();
    //var rbalQty = parseFloat($('#tdBalQty' + index).text());
    var rbalQty = parseFloat($('#hdn_tdBalQty' + index).val());
    //if Qty in header is empty  
   // $('#tUnAllocated').val(0);
    //alert("tQty " + tQty)
    if (!(tQty > 0)) {

        $('#t_ReqQty' + index).val("");
        //$('#tBatchQty').val(0);
        //$('#StBatchQty').text(0);
        flag = false;
       // runError("Enter Total Amount..!!");
    }
    //Row wise in popup
    else if (rQty > rbalQty) {

        $('#t_ReqQty' + index).val("");
        flag = false;
        $('#errLblBalQtyCheck').text("");
        runError("Amount Not Available..!!");
    }


    if (!(calcValues_PopUpBillWiseRef())) {
        $('#t_ReqQty' + index).val("");
        var _referenceData = referenceData;
        //$('#errLblBalQtyCheck').text("");
        runError("Reference " + _referenceData[index].focusDoc + " of date " + _referenceData[index].docDate + " allocated amount is greater than total..!!");
    }
  
    //var index = $("#hdn_rowId").val()   
    //var totnetAmt = parseFloat($("#Amount_" + index).val());
    //$('#tUnAllocated').val(totnetAmt - (parseFloat($('#tUnAllocated').val()) + parseFloat($('#tBatchAlloc_Qty').val())));

}

function checkUnAllocated() {
    //alert("checkUnAllocated")
    //lRefAdjAmt = tBatchAlloc_Qty
    //lVoucherAmt = tBatchQty
    //lBalAmount = tBatchBalQty
   //---------------------------------------------------------//
    $('#hdn_iRefRowID').val(-1);
    //if (referenceData.length > 0)
    {
        if (!(calcValues_PopUpBillWiseRef())) {
            // $('#t_ReqQty' + index).val("");
            // var _referenceData = referenceData;
            //$('#errLblBalQtyCheck').text("");
            $('#tUnAllocated').val("");
            runError("Allocated amount is greater than total..!!");
        }
    
        else {

            var fUnallocatedAmt = 0;
            if ($('#tUnAllocated').val() != "") {
                //fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
                fUnallocatedAmt = parseFloat($('#tUnAllocated').val()).toFixed(fDecFixAmount);
                fUnallocatedAmt = parseFloat(fUnallocatedAmt);
                $('#tUnAllocated').val(fUnallocatedAmt); //.toFixed(fDecFix)
            }
            var index = $("#hdn_rowId").val()
            // var totnetAmt = parseFloat(document.getElementById("netAmt").innerHTML);
            var totnetAmt = applyExchngRateToAmt(index);
            // var balance = parseFloat($('#tBatchBalQty').text()); //lBalAmount
            if (fUnallocatedAmt > totnetAmt) {
                // alert("ys" )
                //if (balance > 0)
                //  $('#tUnAllocated').val(totnetAmt);//here
            }
            var totAdjAmt = parseFloat($('#tBatchAlloc_Qty').val())//lRefAdjAmt
            //alert("checkUnAllocated-totAdjAmt" + totAdjAmt)
            // alert("checkUnAllocated-tUnAllocated " + fUnallocatedAmt)
            // alert("checkUnAllocated-totnetAmt " + totnetAmt)
            //var Bal = totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val()));
            var Bal = totnetAmt - (totAdjAmt);
            Bal = Bal;
            console.log("Bal " + Bal)
            if (Bal < 0) {
                $('#tUnAllocated').val("");
                runError("Allocated amount is greater than total..!!");
            }
            else {
                $('#tBatchBalQty').val(Bal); //.toFixed(fDecFix)
            }

            $('#StBatchBalQty').text($('#tBatchBalQty').val());
        }
    } 
    
   // calcValues_PopUpBillWiseRef();
    //---------------------------------------------------------//
    //if (totAdjAmt > 0) {
    //    var totAmt = totAdjAmt + fUnallocatedAmt //lVoucherAmt
    //   // alert("totAmt" + totAmt + "tBatchQty" + $('#tBatchQty').val())
    //    if (totAmt != $('#tBatchQty').val()) { //lVoucherAmt
    //       // $('#tUnAllocated').val(0)//here
    //        //$('#lBalAmount').text(totnetAmt - parseFloat($('#lRefAdjAmt').text()))
    //        //$('#tBatchBalQty').val(totnetAmt - parseFloat($('#tBatchAlloc_Qty').val()))
    //        alert("tBatchAlloc_Qty if" + $('#tBatchAlloc_Qty').val())
    //        alert("tUnAllocated if" + fUnallocatedAmt)
    //        alert("totnetAmt if" + totnetAmt)

    //        $('#tBatchBalQty').val(totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val())));
    //    }
    //    //else {
    //    //   // $('#lBalAmount').text(totnetAmt - (parseFloat($('#tUnAllocated').val()) + parseFloat($('#lRefAdjAmt').text())));
    //    //    $('#tBatchBalQty').val(totnetAmt - (parseFloat($('#tUnAllocated').val()) + parseFloat($('#tBatchAlloc_Qty').val())));
    //    //}
    //}
    //else {
    //   alert("tBatchAlloc_Qty else" + $('#tBatchAlloc_Qty').val())
    //    alert("tUnAllocated else" + fUnallocatedAmt)
    //    alert("totnetAmt else" + totnetAmt)
       
    //   // $('#lBalAmount').text(totnetAmt - (parseFloat($('#tUnAllocated').val()) + parseFloat($('#lRefAdjAmt').text())));
    //    $('#tBatchBalQty').val(totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val())));
       
    //}

    //alert("tBatchBalQty" + $('#tBatchBalQty').val())
    //console.log("checkUnAllocated Bal : " + $('#tBatchBalQty').val())
    //$('#tUnAllocated').val($('#tBatchBalQty').val());
}
$("#btnPickAmount").click(function () {
    var iRefRowId = $('#hdn_iRefRowID').val();
    var totalQty = $('#tBatchBalQty').val();
    //alert("iRefRowId " + iRefRowId)
    //alert("totalQty " + totalQty)
    // 
    var fUnallocatedAmt = 0;
    if ($('#tUnAllocated').val() != "") {
       // fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
        fUnallocatedAmt = parseFloat($('#tUnAllocated').val()).toFixed(fDecFixAmount);
        fUnallocatedAmt = parseFloat(fUnallocatedAmt);
    }
    //if (totalQty > 0)
    {
        // alert("iRefRowId " + iRefRowId)
        //  alert("totalQty " + totalQty)
        var iTb_rowID = $("#hdn_rowId").val();
        var totnetAmt = applyExchngRateToAmt(iTb_rowID);
        
        if (iRefRowId == -1) {
            //totalQty= totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val()))
            //alert("btnPickAmount-tBatchAlloc_Qty "+parseFloat($('#tBatchAlloc_Qty').val()))
            totalQty = totnetAmt - (parseFloat($('#tBatchAlloc_Qty').val()))
            totalQty += fUnallocatedAmt;
            //alert("totalQty " + totalQty)
            //totalQty.toFixed(4);
            //alert("totalQty " + totalQty)
            totalQty = totalQty.toFixed(fDecFixAmount);
            totalQty = parseFloat(totalQty);

            $("#tUnAllocated").val(totalQty); //.toFixed(fDecFix)
        }
        else {
           
            var _fQty = parseFloat($('#hdn_tdBalQty' + iRefRowId).val());//_referenceData[i].fQty
            if ($('#t_ReqQty' + iRefRowId).val() == "") {
                $('#t_ReqQty' + iRefRowId).val(0);
            }
            var reqfQty = parseFloat($('#t_ReqQty' + iRefRowId).val());
            //alert("reqfQty" + reqfQty)
           // totalQty = totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val())); //parseFloat($('#tBatchAlloc_Qty').val()) - _fQty
            //allocated has newref amt
            totalQty = totnetAmt - (parseFloat($('#tBatchAlloc_Qty').val())); //parseFloat($('#tBatchAlloc_Qty').val()) - _fQty
            totalQty += reqfQty;
            //totalQty.toFixed(4);
           // _fQty.toFixed(4);

            //alert("aloc  " + $('#tBatchAlloc_Qty').val());
            //alert("totalQty " + totalQty);
            //alert("totnetAmt " + totnetAmt);
            //alert("fUnallocatedAmt " + fUnallocatedAmt);
            //alert("_fQty " + _fQty);
            // alert("reqfQty " + reqfQty)
            // alert("totalQty " + totalQty)
            // console.log("totalQty" + totalQty)
            // console.log("tBatchAlloc_Qty" + parseFloat($('#tBatchAlloc_Qty').val()));
            // console.log("_fQty" + _fQty)
            if (((parseFloat($('#hdn_tdBalQty' + iRefRowId).val())) != "") && ((parseFloat($('#hdn_tdBalQty' + iRefRowId).val())) != NaN) && (parseFloat($('#hdn_tdBalQty' + iRefRowId).val()) > 0)) {
                if (totalQty > 0) {
                    //_fQty = parseFloat($('#tdBalQty' + i).text());//_referenceData[i].fQty

                    if (_fQty < totalQty) {
                        $("#t_ReqQty" + iRefRowId).val(_fQty); //.toFixed(fDecFix)
                        flag = 1;
                        totalQty -= _fQty;
                    }
                    else {
                        $("#t_ReqQty" + iRefRowId).val(totalQty); //.toFixed(fDecFix)
                        totalQty = 0;
                    }
                }
                //else {
                //    $("#t_ReqQty" + i).val("");
                //}
            }
        }

        calcValues_PopUpBillWiseRef();
    }

});


$("#btnLoadReferencePopup").click(function () {
   
    //var array = "";
    //var qtyType = $("#hdn_qtyType").val();
    //var bFoc = 0;

    var fUnallocatedAmt = 0;
    if ($('#tUnAllocated').val() != "") {
        fUnallocatedAmt = parseFloat($('#tUnAllocated').val());
    }
    var iTb_rowID = $("#hdn_rowId").val();
    var totnetAmt = applyExchngRateToAmt(iTb_rowID);
   // $('#tBatchBalQty').val(totnetAmt - (fUnallocatedAmt + parseFloat($('#tBatchAlloc_Qty').val())));
    $('#tBatchBalQty').val(totnetAmt - (parseFloat($('#tBatchAlloc_Qty').val())));
    $('#StBatchBalQty').text($('#tBatchBalQty').val());

    //alert("btnLoadReferencePopup Bal" + $('#tBatchBalQty').val());
    if ($('#tBatchBalQty').val() == 0) {
       // alert("inside if ...")
        // if (qtyType == 1) {//1. qty  2. free qty
        //$("#t_fAmount" + tb_rowID).val($("#tBatchQty").val());
        //}
        //else if (qtyType == 2) {
        // $("#fFoc" + tb_rowID).val($("#tBatchQty").val());
        //}
        var _referenceData = referenceData; //.table
       // if (_referenceData.length > 0)
       // {

            //var iproduct = $("#ProductSelect" + tb_rowID + "-id").val();
            // var iunit = $("#UnitSelect" + tb_rowID).val();
            // var iwarehouse = $("#WarehouseSelect-id").val();
            //let dm = new DataManipulation();
            var iTransId = 0;
            if (type == 2) {
                iTransId = $("#hdn_iTransID").val();
            }
            // var res = dm._apiGet("/Sales/GetProductBatchDetails", { apiname: "GetProductBatchDetails", iProduct: iproduct, iWarehouse: iwarehouse, iUnit: iunit, iTransId: iTransId }).then(function (data) {


            //var tb_rowID = $("#hdn_rowId").val();
            // array = 'referenceData_loadfQty' + tb_rowID;
            // alert("in batch dyn.." );
            dynamicArrayfQty(_referenceData);

            //});    

        //}
    }
    //else if ($('#tBatchBalQty').val() == "") {
    //    $('#errLblBalQtyCheck').text("Pls fill required qty..!!");
    //}
    else {
        //$('#errLblBalQtyCheck').text("Balance Quantity should be Zero..!!");

        runError("Balance amount should be Zero..!!");
    }


});
function applyExchngRateToAmt(iTb_rowID) {

    var totnetAmt = $("#Amount_" + iTb_rowID).val();
    if (totnetAmt == "") {
        totnetAmt = 0;
    }
    else {
        totnetAmt = parseFloat(totnetAmt).toFixed(fDecFixAmount);
    }

    var exchRate = $("#fExchangeRate").val();
    if (exchRate == "") {
        exchRate = 0;
    }
    else {
        exchRate = parseFloat($("#fExchangeRate").val());
    }
   
    if (exchRate < 0) {
        exchRate = (exchRate)*-1
        //console.log("totnetAmt 1 " + totnetAmt);
        totnetAmt = totnetAmt / exchRate;
    }
    else {
        totnetAmt = totnetAmt * exchRate;
    }
    //console.log("exchRate 1 " + exchRate);
    //console.log("applyExchngRateToAmt " + totnetAmt.toFixed(fDecFixAmount));
    return totnetAmt.toFixed(fDecFixAmount);

}
function dynamicArrayfQty(_referenceData) {

    var tb_rowID = $("#hdn_rowId").val();
    //var iOutlet = $("#OutletSelect" + tb_rowID + "-id").val();
    var iAccount = $("#CreditAccount_" + tb_rowID + "-id").val();
    // var iUnit = $("#UnitSelect" + tb_rowID).val();
    //var iWarehouse = $("#WarehouseSelect-id").val();
    // Invoked during batch change
    //var qtyType = $("#hdn_qtyType").val();
    //var bFoc = 0;

    //if (qtyType == 2)
    //bFoc = 1;

    clearReference(tb_rowID);
    //alert("dyn.. len 1 " + $('#tUnAllocated').val());
    
    //Unallocated
    /* iBatch=sDocNo*/
    /*  iTransId = iRef*/
    var tUnAllocated = parseFloat($('#tUnAllocated').val());
   // alert("dyn.. len 2" + tUnAllocated);
    if (tUnAllocated > 0) {
       
        var v = { "iRow": tb_rowID, "iAccount": iAccount, "sDocNo": "NewReference", "iRef": 0, "fQty": tUnAllocated, "iRefType": 2 };  //fBatchQty  //, "bFoc": bFoc
        referenceData_load.push(v);
    }
    if (_referenceData.length > 0) {
        for (i = 0; i < _referenceData.length; i++) {
            var t_ReqQty = parseFloat($('#t_ReqQty' + i).val());
            if (t_ReqQty > 0) {
                var iBatchQty = $("#tBatchQty").val();
                //"iBatch":_referenceData[i].docNo
               
                var v = { "iRow": tb_rowID, "iAccount": iAccount, "sDocNo": _referenceData[i].focusDoc, "iRef": _referenceData[i].refId, "fQty": t_ReqQty, "iRefType": 1 };  //fBatchQty  //, "bFoc": bFoc
                referenceData_load.push(v);
                console.log("referenceData_load push:" + JSON.stringify(v));
            }
        }
    }
    var referenceData_loadFiltered = referenceData_load.filter(x => (x.iRow == tb_rowID) && (x.iAccount == iAccount));//&& (x.bFoc == bFoc)
    if (referenceData_loadFiltered.length > 0) {
        var sDocNo = '';
        $.each(referenceData_loadFiltered, function () {
            sDocNo += this.sDocNo + ',';
        });
        sDocNo = sDocNo.trimRight();
        sDocNo = sDocNo.slice(0, - 1);

        $("#Reference_" + tb_rowID).val("");
        $("#Reference_" + tb_rowID).val(sDocNo);
        $("#GetMasterListfQtyBatch").hide();
    }

}


//function LoadFIFO() {
function LoadReferenceFIFO() {
    // alert("FIFO referenceData" + referenceData);
    // var _referenceData = referenceData.record;//.table
    // var dataParse = JSON.parse(referenceData);
    // dataParse = dataParse.ResultData;
    // alert("1."+ data)
   // if ($("#Amount_" + index).val() > 0) {
        var _referenceData = referenceData;
        if (_referenceData.length > 0) {
            //var flag = 0;
           // var totalQty = parseFloat($("#tBatchQty").val());
            //--------------------------------------------//
            //alert("tUnAllocated " + $("#tUnAllocated").val())

            var fNewRef = $("#tUnAllocated").val();
            if (fNewRef == "" || fNewRef == NaN) {
                fNewRef = 0.0000;
            }
            fNewRef = parseFloat(fNewRef);
            var index = $("#hdn_rowId").val()
           // var fRowAmt = parseFloat($("#Amount_" + index).val())
            var fRowAmt = applyExchngRateToAmt(index);
            //alert("fRowAmt " + fRowAmt);
            var totalQty = fRowAmt - fNewRef;
          //  totalQty = totalQty.toFixed(4)
            //--------------------------------------------//
            //alert("totalQty " + totalQty)
            if (totalQty > 0) {
                var _fQty = 0;
                for (var i = 0; i < _referenceData.length; i++) {
                   // alert(parseFloat($('#hdn_tdBalQty' + i).val()));
                    //  if (((parseFloat($('#tdBalQty' + i).text())) != "") && ((parseFloat($('#tdBalQty' + i).text())) != NaN) && (parseFloat($('#tdBalQty' + i).text()) > 0)) {
                    if (((parseFloat($('#hdn_tdBalQty' + i).val())) != "") && ((parseFloat($('#hdn_tdBalQty' + i).val())) != NaN) && (parseFloat($('#hdn_tdBalQty' + i).val()) > 0)) {
                        if (totalQty > 0) {
                           _fQty = parseFloat($('#hdn_tdBalQty' + i).val());                          
                            if (_fQty < totalQty) {                               
                                $("#t_ReqQty" + i).val(_fQty); //.toFixed(fDecFix)
                                totalQty -= _fQty;
                            }
                            else {                                
                                $("#t_ReqQty" + i).val(totalQty); //.toFixed(fDecFix)
                                totalQty = 0;
                            }
                        }
                        else {
                            $("#t_ReqQty" + i).val("");
                        }
                    }
                }
                // calcValues_PopUpBatch();
                calcValues_PopUpBillWiseRef();
                //$("#tUnAllocated").val(0.00);

            }
        }
    //}
}

$("#btnClosePopup").click(function () {
    $("#GetMasterListfQtyBatch").hide();

});


function blurCurrency(e) {//for getting exchange Rate
    // var CurrencyId = $("#" + e.currentTarget.id + "-id").val();
    // var CurrencyField = e.currentTarget.id;

    var CurrencyId = $("#iCurrency-id").val();
    // alert("blurCurrency" + CurrencyId)
    var iDate = $('#tdate').val();  // iVdate
    if (iDate == "") {

        runError("Select Date");
    }
    else {
        iDate = ConvertDate(iDate);
        // if (CurrencyId > 0)
        {
            $.ajax({
                url: '/FocusMaxTransaction/GetExchangeRate/',
                method: 'get',
                /*  data: { iCurrency: CurrencyId, iDate: iDate },*/
                data: { sApiName: "GetExchangeRate", sParamOne: "iCurrency", sParamOneVal: CurrencyId, "sParamTwo": "sdate", "sParamTwoVal": iDate, "sParamThree": "iCompany", "sParamThreeVal": $("#Company-id").val() },
                dataType: 'json',
                success: function (data) {

                    var result = data.ResultData;
                    data = JSON.parse(result);
                     //alert("GetExchangeRate" + JSON.stringify(data));
                    //data = data.Table;    
                    data = data[0].fExcRate;

                    if (data != (-1)) {
                        // if (CurrencyField == "iCurrency") {

                        $('#fExchangeRate').val(data.toFixed(fDecFix));//.toFixed(5)--- header
                        //                    }
                        //                    else {
                        //                        $('#fInputExchangeRate').val(data.toFixed(5)); //.toFixed(5) --popup
                        //                        getBaseAmount();
                        //                    }

                    }
                },
                //error: function (response) {
                //    $.ajax({
                //        url: "/Master/Error",
                //        data: { Message: response.responseText },
                //        success: function (data, res) {
                //        }
                //    });
                //}
            });

        }
    }
}

