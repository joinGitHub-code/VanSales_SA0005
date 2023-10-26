
$("#sDocNo").focus();
var body = "";
var Griddata = [];
var body_selected = [];
var MainBody = [];
var bodyData = [];
var type = 1;
var imagesdata = [];
var ch = 0;
var flag = 0;
$.ajax({
    url: '/Settings/GetUserScreens/',
    method: 'get',
    dataType: 'json',
    success: function (data) {
        //   alert(JSON.stringify(data));
        var id = data[0];
        if (id == 0) {
            $("#Denied").hide();
            $("#view").show();
        }
        else {
            $.ajax({
                url: "/Settings/View_RoleDetails",
                data: { iRoleId: parseInt(id) },
                success: function (data, res) {

                    //  alert(JSON.stringify(data))
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].iId == 10) {
                            flag = 1;
                        }
                    }
                    if (flag == 1) {
                        $("#Denied").hide();
                        $("#view").show();
                    }
                    else {
                        $("#Denied").show();
                        $("#view").hide();
                    }
                }
            });
        }
    }
});
$(function () {
    function ConvertDate(date) {
        //alert(date)
        var d = date.split('-');
        var day = d[0];
        var month = d[1];
        var year = d[2];
        return [year, month, day].join('-');
    }
    function formatDate(date) {
        //alert(date)
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }
    function clear() {
        var date = formatDate(new Date());
        $("#iDocDate").val(date);
        $("#iPaymentDate").val(date);
        $("#rbBank").prop("checked", true);
        $("#txtiId").val(0);
        $("#txtiLevel").val(1);
    }
    clear();
    var a = 0;
    var days = 0;

    function check() {
       
        $.ajax({
            url: "/Transaction/Check",
            success: function (data, res) {
                $("#txtiId").val(data[0].iId);
                $("#txtiLevel").val(data[0].iLevel);
                var type = data[0].type;
                var ScreenType = data[0].ScreenType;
                if (ScreenType == 0)
                {
                    $("#Screen1").show();
                    $("#Screen2").hide();
                    $("#btnnewbody").show();
                    $("#btndeletebody").show();
                    if( parseInt( $("#txtiLevel").val())==4)
                    {
                        $("#btncloseapv").show();
                        $("#btnclose").hide();
                    }
                    else {

                        $("#btncloseapv").hide();
                        $("#btnclose").show();
                    }
                }
                else {
                    if ($("#txtiLevel").val() == 1) {
                        $("#Screen1").show();
                        $("#Screen2").hide();
                        $("#btnnewbody").show();
                        $("#btndeletebody").show();
                        $("#btncloseapv").show();
                        $("#btnclose").hide();
                    }
                    else {
                        $("#Screen1").hide();
                        $("#Screen2").show();
                        $("#btnnewbody").hide();
                        $("#btndeletebody").hide();
                        if ($("#txtiLevel").val() == 3) {
                            $("#apv").text("Confirmation");
                            $("#apv").prepend('<i class="fa fa-1x fa-plus-circle" style="padding-left: 6px;"></i>')
                            $("#btnRjt").hide();
                        }
                       else if ($("#txtiLevel").val() == 4) {
                           $("#apv").text('Proceed');
                           $("#apv").prepend('<i class="fa fa-1x fa-plus-circle" style="padding-left: 6px;"></i>')
                           $("#btnRjt").hide();
                        }
                    }
                }
                if (type == 2) {
                    $.ajax({
                        url: "/Transaction/View_TransHeader",
                        data: { iTransId: parseInt($("#txtiId").val()) },
                        success: function (data, res) {
                            //alert(JSON.stringify(data))
                            $("#txtiId").val(data[0].iTransId);
                            $("#sDocNo").val(data[0].sDocNo);
                            var date = formatDate(data[0].iDocDate);
                            $("#iDocDate").val(date);
                            $("#VendorSelect-id").val(data[0].iVendor);
                            $("#VendorSelect").val(data[0].Vendor);
                            $("#CompanySelect-id").val(data[0].iCompany);
                            $("#CompanySelect").val(data[0].Company);

                            $("#BeneficiarySelect-id").val(data[0].iBeneficiary);
                            $("#BeneficiarySelect").val(data[0].sBeneficiary);
                            getGrid();
                            $("#BanksSelect-id").val(data[0].iBank);
                            $("#BanksSelect").val(data[0].sBank);
                            $("#FocusBanksSelect-id").val(data[0].iFocusBank);
                            $("#FocusBanksSelect").val(data[0].sFocusBank); 
                            $("#sBankAccount").val(data[0].sBankAcNo);
                            $("#sBankAddress").val(data[0].sBankAddress);
                            $("#sBankIBAN").val(data[0].sBankIBAN);
                            $("#sBankSWIFT").val(data[0].sBankSWIFT);
                            $("#sBankCountry").val(data[0].sBankCountry);

                            $("#sRefNo").val(data[0].sRefNo);
                            $("#sNarration").val(data[0].sNarration);
                            var date = formatDate(data[0].iPaymentDate);
                            $("#iPaymentDate").val(date);
                            $("#txtistatus").val(data[0].iStatus);
                            $("#txtiApproved").val(data[0].iApproved);
                            $('select option:contains(' + data[0].sCurrency + ')').prop('selected', true);
                            //$("#ExcRaterSelect-Rate").val($("#excrate").find("option:selected").val());
                            $("#ExcRateSelect").val($("#excrate").find("option:selected").text());
                            $("#ExcRaterSelect-Rate").val(data[0].fExchRate);
                            if (data[0].iType == 1) {
                                $("#rbBank").prop("checked", true);
                            }
                            else if (data[0].sPropertyType == 2) {
                                $("#rbCash").prop("checked", true);
                            }
                            buildMenuPaymentProof(data[0].sPaymentProof);
                            $("#PaymentProofs").val(data[0].sPaymentProof);
                            $.ajax({
                                url: "/Transaction/View_TransDetails",
                                data: { iTransId: parseInt($("#txtiId").val()) },
                                success: function (data, res) {
                                    if (data.length > 0) {
                                        var bamt = 0;
                                       
                                        for (var i = 0; i < data.length; i++) {
                                            var chk = 0;
                                            bamt = bamt + data[i].fAmount;
                                            for (var j = 0; j < Griddata.length; j++) {
                                                if(data[i].RefId== Griddata[j].RefId)
                                                {
                                                    bamt = bamt + parseFloat(Griddata[j].Amount);
                                                    chk++;
                                                    Griddata[j].BillAmount = bamt;
                                                    Griddata[j].Amount = data[i].fAmount;
                                                }
                                            }
                                            MainBody_list = { RefId: data[i].RefId, focusdoc: data[i].sFocusDocNo, sInvoiceNo: data[i].sInvoiceNo, iInvoiceDate: data[i].iInvoiceDate, iInvoiceDueDate: data[i].iInvoiceDueDate, creditdays: data[i].creditdays, currency: data[i].currency, fAmount: data[i].fAmount, BillAmount: bamt, EntityId: data[i].EntityId, Entity: data[i].Entity, CostCenterId: data[i].CostCenterId, CostCenter: data[i].CostCenter, TradeNoId: data[i].TradeNoId, TradeNo: data[i].TradeNo, SubTradeNoId: data[i].SubTradeNoId, SubTradeNo: data[i].SubTradeNo, DivisionId: data[i].DivisionId, Division: data[i].Division, sRemarks: "", sInvoiceRef: "", sAttachment: data[i].sAttachment };
                                            MainBody.push(MainBody_list);
                                            if (chk==0){
                                                MainBody_list1 = { RefId: data[i].RefId, focusdoc: data[i].sFocusDocNo, DocNo: data[i].sInvoiceNo, DocDate: data[i].iInvoiceDate, DueDate: data[i].iInvoiceDueDate, creditdays: data[i].creditdays, currency: data[i].currency, Amount: data[i].fAmount, BillAmount: bamt, EntityId: data[i].EntityId, Entity: data[i].Entity, CostCenterId: data[i].CostCenterId, CostCenter: data[i].CostCenter, TradeNoId: data[i].TradeNoId, TradeNo: data[i].TradeNo, SubTradeNoId: data[i].SubTradeNoId, SubTradeNo: data[i].SubTradeNo, DivisionId: data[i].DivisionId, Division: data[i].Division, sRemarks: "", sInvoiceRef: "", sAttachment: data[i].sAttachment };
                                                Griddata.push(MainBody_list1);
                                            }
                                            bamt=0;
                                        }
                                        // MainBody.push(data);
                                        ///change amount//billamount 
                                       // build_bodynew(data);
                                        build_bodynew(MainBody);
                                        bodyData = MainBody;
                                    }
                                    else {
                                        ///no data
                                    }
                                }
                            });
                            
                        }
                    });
                }
                if(type==1)
                {
                    $.ajax({
                        url: "/Transaction/GetDocNo",
                        success: function (data, res) {
                            if (data.length > 0) {
                                var d = data[0];
                                var n = d.substring(3, d.length);
                                n++;
                                $("#sDocNo").val((d.substring(0, 3)) + n);
                            }
                            else {
                                $("#sDocNo").val("Doc1");
                            }
                        }
                    });
                }
            },
            error: function (response) {
                $.ajax({
                    url: "/Transaction/Error",
                    data: { Message: response.responseText },
                    success: function (data, res) {
                    }
                });
            },
            failure: function (response) {
                $.ajax({
                    url: "/Transaction/Error",
                    data: { Message: response.responseText },
                    success: function (data, res) {
                    }
                });
            }
        })
    }
    check();

    $("#btnsave").click(function () {
       
        if ($("#txtiApproved").val() != 1) {
            var d = {};
            d.iLevel = $("#txtiLevel").val();
            d.iTransId = $("#txtiId").val();
            d.sDocNo = $("#sDocNo").val();
            d.iDocDate = $("#iDocDate").val();
            d.iCompany = $("#CompanySelect-id").val();
            d.Company = $("#CompanySelect").val();
            d.iVendor = $("#VendorSelect-id").val();
            d.Vendor = $("#VendorSelect").val();
         
            d.iBeneficiary=$("#BeneficiarySelect-id").val();
            d.sBeneficiary =$("#BeneficiarySelect").val();
            d.iBank =$("#BanksSelect-id").val();
            d.sBank =$("#BanksSelect").val();
            d.iFocusBank=$("#FocusBanksSelect-id").val();
            d.sFocusBank=$("#FocusBanksSelect").val();
            d.sBankAcNo = $("#sBankAccount").val();
            d.sBankAddress=$("#sBankAddress").val();
            d.sBankIBAN=$("#sBankIBAN").val();
            d.sBankSWIFT=$("#sBankSWIFT").val();
            d.sBankCountry=$("#sBankCountry").val();


            d.sNarration = $("#sNarration").val();
            // d.sBank = $("#sBank").val();
            d.sRefNo = $("#sRefNo").val();
            d.iPaymentDate = $("#iPaymentDate").val();
            d.iType = $("input[name='Method']:checked").val();
            d.fExchRate = parseFloat($("#ExcRaterSelect-Rate").val());
            d.sCurrency = $("#ExcRateSelect").val();
            d.sPaymentProof = $("#PaymentProofs").val();
            TransBody = [];
            var flag = 0;
            var id = $("#binddata").find("tr").last().attr('id');
            for (var i = 0; i <= id; i++) {
                //if ($("#EntitySelect" + i).val() == "")
                //{
                //    flag = 1;
                //    runError("Please Fill  Entity in Focus")
                //}
                //else if ($("#CostCenterSelect" + i).val() == "") {
                //    flag = 1;
                //    runError("Please Fill  CostCenter in Focus")
                //}
                //else if ($("#TradeNoSelect" + i ).val() == "") {
                //    flag = 1;
                //    runError("Please Fill  TradeNo in Focus")
                //}
                //else if ($("#SubTradeNoSelect" + i ).val() == "") {
                //    flag = 1;
                //    runError("Please Fill  SubTradeNo in Focus")
                //}
                //else if ($("#DivisionSelect" + i).val() == "") {
                //    flag = 1;
                //    runError("Please Fill  Division in Focus")
                //}
                //else {
                flag = 0;
                TransBody_list = { RefId: $("#RefId" + i).val(),focusdoc: $("#focusdoc" + i).val(), sInvoiceNo: $("#sInvoiceNo" + i).val(), iInvoiceDate: ConvertDate($("#iInvoiceDate" + i).val()), iInvoiceDueDate: ConvertDate($("#iInvoiceDueDate" + i).val()),creditdays: $("#creditdays" + i).val(),currency: $("#currency" + i).val(), fAmount: $("#fAmount" + i).val(), iEntity: $("#EntitySelect" + i + "-id").val(), sEntity: $("#EntitySelect" + i).val(), iCostCenter: $("#CostCenterSelect" + i + "-id").val(), sCostCenter: $("#CostCenterSelect" + i).val(), iTradeNo: $("#TradeNoSelect" + i + "-id").val(), sTradeNo: $("#TradeNoSelect" + i).val(), iSubTradeNo: $("#SubTradeNoSelect" + i + "-id").val(), sSubTradeNo: $("#SubTradeNoSelect" + i).val(), iDivision: $("#DivisionSelect" + i + "-id").val(), sDivision: $("#DivisionSelect" + i).val(), sRemarks: $("#sRemarks" + i).val(), sInvoiceRef: $("#sInvoiceRef" + i).val(), sAttachment: $("#sAttachment" + i).val() };
                TransBody.push(TransBody_list);
                //}
            }
            d.TransBody = TransBody;
            if (parseInt($("#txtiLevel").val()) == 4) {
                if ($("#PaymentProofs").val() == "") {
                    $("#PaymentProofs").focus();
                    flag = 1;
                    $("#loaddata").hide();
                    $("#nonloaddata").show();
                    runError("Payment Proof Required..!!");
                }
            }
            if ($("#sDocNo").val() == "") {
                $('#sDocNo').focus();
                runError("DocNo Required..!!");
            }
            else if ($("#iDocDate").val() == "") {
                runError("DocDate Required..!!");
            }
            else if ($("#CompanySelect").val() == "") {
                runError("Company Required..!!");
            } else if ($("#VendorSelect").val() == "") {
                runError("Vendor Required..!!");
            }
            else if(flag!=0)
            {}
            else {
                $("#loaddata").show();
                $("#nonloaddata").hide();
                $.ajax({
                    url: '/Transaction/Ins_UpTrans',
                    type: 'POST',
                    dataType: 'JSON',
                    data: { obj: d },
                    success: function (data) {
                        //$("#loaddata").hide();
                        //$("#nonloaddata").show();
                        if (parseInt($("#txtiLevel").val()) == 4) {
                            $.ajax({
                                url: '/Transaction/Approve_Trans',
                                data: { ids: $("#txtiId").val(), iLevel: parseInt($("#txtiLevel").val()), status: 1, remarks: '' },
                                success: function (data) {

                                    $("#loaddata").hide();
                                    $("#nonloaddata").show();
                                    runsuccess(data + "..!!!", "/Transaction/TransApproveSummary");
                                }


                            });


                            // runsuccess("Saved" + "..!!!", "/Transaction/TransApproveSummary");
                            //runsuccess("Saved" + "..!!!", "/Transaction/AddTrans?iId=" + 0 + "&&type=" + type + "&&ScreenType=" + 0);
                        }
                        else {
                            runsuccess("Saved" + "..!!!", "/Transaction/AddTrans?iId=" + 0 + "&&type=" + type + "&&ScreenType=" + 0);
                        }
                    },
                    error: function (data) {
                        if (data.responseText == "Updated" || data.responseText == "Inserted") {
                            $("#loaddata").hide();
                            $("#nonloaddata").show();
                            if (parseInt($("#txtiLevel").val()) == 4) {
                                $.ajax({
                                    url: '/Transaction/Approve_Trans',
                                    data: { ids: $("#txtiId").val(), iLevel: parseInt($("#txtiLevel").val()), status: 1, remarks: '' },
                                    success: function (data) {

                                        $("#loaddata").hide();
                                        $("#nonloaddata").show();
                                        runsuccess(data + "..!!!", "/Transaction/TransApproveSummary");
                                    }


                                });

                                //runsuccess("Saved" + "..!!!", "/Transaction/TransApproveSummary");
                                //runsuccess("Saved" + "..!!!", "/Transaction/AddTrans?iId=" + 0 + "&&type=" + type + "&&ScreenType=" + 0);
                            }
                            else {
                                runsuccess("Saved" + "..!!!", "/Transaction/AddTrans?iId=" + 0 + "&&type=" + type + "&&ScreenType=" + 0);
                            }
                        }
                    }
                });
            }
        }
        else {
            runError("Already Approved")
        }
    });
   
    /////////////////view Image
    var indexpopup = 0;
    var l = 0;
    var s = 0;
    var Imagesdata = [];

    $(document).on('click', 'tr #sAttachment', function () {
        //  alert(s)
        Phototype = 1;
        s = $(this).closest("tr").attr('id');
        //   alert(s);
        var h = "";
        var n = 0;
        var len = 0;
        var MImg = [];
        
        items=$("#sAttachment" + s).val();
        if (items == "" || items == null) {
            len = 0;
        }
        else {
            items = (items).replace(/,\s*$/, "");
            items = (items).replace(/^,/, "");
            MImg = (items).split(",");
            len = MImg.length;
        }
        Imagesdata = MImg;
        //itransdtid = bodyData[s].iTransDtId;
        if (len == 0) {
            $("#modalfile").html("");
            var li = $('<ul class="col-lg-2" ><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">No Data</label></li></ul>');
            li.appendTo($("#modalfile"));
            $('#myModal').show();
        }
        else {
            var r = MImg[0]
            // alert(JSON.stringify(filesdata))
            $("#modalfile").html("");
            id = 0;
            for (var i = 0; i < MImg.length; i++) {
                var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><a href="DeviationpathPaymentProof/?Id=' + new String(MImg[i]) + '" target="_blank"><i class="fa fa-file-pdf-o"></i><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' + MImg[i] + '</label></a></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
                li.appendTo($("#modalfile"));
                id++;
            }
            $('#myModal').show();
        }
    });
    $("#btnclosefile").click(function () {
        $('#myModal').hide();

    })
    ///////////////////////////////body   attach

    $(document).on('change', 'tr #sAttachments', function () {
        s = $(this).closest("tr").attr('id');

        var fd = new FormData();
        // alert(JSON.stringify(s1));
        var j = 0;
        for (var i = 0; i < $("#sAttachments" + s).get(0).files.length; i++) {
            var filename = $("#sAttachments" + s).get(0).files[i].name;
            //fd.append("images" + i, $("#sAttachments" + s).get(0).files[i]);
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".pdf") || filename.endsWith(".eml")) {
                fd.append("images" + i, $("#sAttachments" + s).get(0).files[i]);
            }
            else {
                j++;
                if ($("#sAttachments" + s).get(0).files.length == (j)) {
                    runError("unsupport format");
                    //$("label[for='msg']").text("unsupport format");
                    //$('#msgModal').show();
                }
            }
        }

        $.ajax({
            url: "/Transaction/UploadPhoto_Body?id=" + 1 + "&&attachment=" + $("#sAttachment" + s).val(),
            data: fd,
            type: "POST",
            contentType: false,
            processData: false,
            success: function (data, headers, status, config, files) {
               
                var count1len = 0, count2len = 0;
                var count1 = 0;
                if (data == "" || data == null) {
                    count1len = 0;
                }
                else {
                    data = (data).replace(/,\s*$/, "");
                    data = (data).replace(/^,/, "");
                    $("#sAttachment" + s).val(data);
                    if (data == '') {
                        count1len = 0;
                    }
                    else {
                        count1 = (data).split(",");
                        count1len = count1.length;
                    }
                    $("#count" + s).val(count1len);
                    $("#sAttachments" + s).val("");
                }
            }
        });
    });
   
    var Main_body_de = [];
    $('#binddata').on('change', 'input[type=checkbox]', function (event) {
       
        var iAct = $(this).attr('id');
        //alert(iAct);
        if ($(this).prop("checked") == true) {
            var k = { iId: iAct };
            Main_body_de.push(k);
        }
        else if ($(this).prop("checked") == false) {
            var index = 0;
            $.each(Main_body_de, function (value2, key2) {
                if (Main_body_de > index) {
                    if (iAct == key2.iId) {
                        Main_body_de.splice(index, 1);
                    }
                }
                index++;
            });
        }
            
        if ($("#binddata td input[type=checkBox]:checked").length == $("#binddata td input[type=checkBox]").length) {
            $("#tblBody #selectall").prop('checked', true);
        }
        else {
            $("#tblBody #selectall").prop('checked', false);
        }

    });
    $('#tblBody').on('change', 'input[type=checkbox]', function (event) {

        var iAct = $(this).attr('id');
        // alert(iAct);
        if (iAct == "selectall") {
            if ($(this).prop("checked") == true) {
                // $.each(Griddata, function () {
                $('#binddata td input[type="checkbox"]').prop('checked', true);
                var k = { iId: iAct };
                Main_body_de.push(k); 
            }
                // });
            else if ($(this).prop("checked") == false) {
                $('#binddata td input[type="checkbox"]').prop('checked', false);
                Main_body_de = [];
               
            }
        }

        if ($("#binddata td input[type=checkBox]:checked").length == $("#binddata td input[type=checkBox]").length) {
            $("#tblBody #selectall").prop('checked', true);
        }
        else {
            $("#tblBody #selectall").prop('checked', false);
        }

    });

    
    
    $("#btndelete").click(function () {
        $("label[for='msg']").text("Do you want to Delete?");
        $("#modal-DeleteConfirm").show();

    });
    $("#btnyes").click(function () {
        $("#modal-DeleteConfirm").hide();

        $.ajax({
            url: '/Transaction/DeleteTrans',
            data: { ids: $("#txtiId").val() },
            success: function (data) {
                if (data = "Deleted SuccessFully") {
                    runsuccess(data + "..!!!", "/Transaction/TransSummary");
                }
                else if (data = "Linked with User") {
                    runError("Linked with User");
                }
            }
        });
    })
    $("#btnno").click(function () {
        $("#modal-DeleteConfirm").hide();
    })
    $("#btnclosede").click(function () {
        $("#modal-DeleteConfirm").hide();

    })


    //////////////body
    $("#btndeletebody").click(function () {
        if ($("#binddata td input[type=checkBox]:checked").length >= 1) {
            $("label[for='msg1']").text("Do you want to Delete?");
            $("#modal-DeleteConfirm1").show();
            //$("#please-wait").css("display", "block")
        }
        else {
            runError("Please  Select Checkbox");
        }
    });
    $("#btnyes1").click(function () {
        $("#modal-DeleteConfirm1").hide();
        for(var i=0;i<Main_body_de.length;i++)
        {

            if(Main_body_de[i].iId=="selectall")
            {
                $("#binddata tr").remove();
                $("#tblBody #selectall").prop('checked', false);
                MainBody = [];
            }
            else{
                $("#binddata #" + Main_body_de[i].iId).closest("tr").remove();
                for (var j = 0; j < MainBody.length; j++)
                {
                    if(Main_body_de[i].iId==MainBody[j].RefId)
                    {
                        MainBody.splice(j,1)
                    }
                }
               
            }
        }
    })
    $("#btnno1").click(function () {
        $("#modal-DeleteConfirm1").hide();
    })
    $("#btnclosede1").click(function () {
        $("#modal-DeleteConfirm1").hide();

    })
    $("#btnnew").click(function () {
        type = 1;
        window.location = "/Transaction/AddTrans?iId=" + 0 + "&&type=" + type + "&&ScreenType=" + 0;
    });


    //////////PhotoUpload

    function buildMenu(items) {
        //var id = 0;
        //imagesdata = [];
        //$("#imagesdata").html("");
        //imagesdata = items;
        //$.each(items, function () {
        //    var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><a href="Deviationpath/?Id=' + new String(this.sImagePath) + '" target="_blank"><i class="fa fa-file-pdf-o"></i><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' + this.sName + '</label></a></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
        //    //var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:50px;width:135px; list-style-type:none;display:block;padding:0px"><img src="Deviationpath/?Id=' + new String(this.sImagePath) + '" id="viewPopup' + id + '" style="height: 50px; width:40px;" /><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' + this.sName + '</label></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;padding:10px"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
        //    li.appendTo($("#imagesdata"));
        //    id++;
        //});

        var h = "";
        var n = 0;
        var len = 0;
        var MImg = [];
        // alert(items);
        if (items == "" || items == null) {
            len = 0;
        }
        else {
            items = (items).replace(/,\s*$/, "");
            items = (items).replace(/^,/, "");
            MImg = (items).split(",");
            len = MImg.length;
        }
        Imagesdata = MImg;
        //itransdtid = bodyData[s].iTransDtId;
        if (len == 0) {
            $("#modalfile").html("");
            var li = $('<ul class="col-lg-2" ><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">No Data</label></li></ul>');
            li.appendTo($("#modalfile"));
            $('#myModal').show();
        }
        else {
            var r = MImg[0]
            // alert(JSON.stringify(filesdata))
            $("#modalfile").html("");
            id = 0;
            for (var i = 0; i < MImg.length; i++) {
                var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><a href="DeviationpathPaymentProof/?Id=' + new String(MImg[i]) + '" target="_blank"><i class="fa fa-file-pdf-o"></i><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' + MImg[i] + '</label></a></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
                li.appendTo($("#modalfile"));
                id++;
            }
            $('#myModal').show();
        }
        
    }

 


    //////////////HeaderUpload


    var PaymentProofdata = [];
    function buildMenuPaymentProof(items) {
        var id = 0;
        PaymentProofdata = [];
        $("#imagesdata").html("");
        var len = 0;
        var MImg = [];
        if (items == "" || items == null) {
            len = 0;
        }
        else {
            items = (items).replace(/,\s*$/, "");
            items = (items).replace(/^,/, "");
            $("#PaymentProofs").val(items)
            MImg = (items).split(",");
            len = MImg.length;
        }
        PaymentProofdata =  MImg;
        for(var i=0;i<PaymentProofdata.length;i++){
            var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:8px;width:175px; list-style-type:none;display:block;padding:0px"><a href="DeviationpathPaymentProof/?Id=' + new String(MImg[i]) + '" target="_blank"><i class="fa fa-file-pdf-o"></i><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' + MImg[i] + '</label></a></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
            //    var li = $('<ul class="col-lg-2" id="' + id + '"><li style="height:50px;width:135px; list-style-type:none;display:block;padding:0px"><img src="DeviationpathPaymentProof/?Id=' + new String(MImg[i]) + '" id="viewPopup' + id + '" style="height: 50px; width:40px;" /><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:80px;">' +  + '</label></li></ul><ul  id="img' + id + '"><li style="height:8px;width:50px; list-style-type:none;display:block;padding:10px"><img src="../Content/Img/close_icons.png" id="btnclosefile" style="height: 10px; width:10px;" /></li></ul>');
            li.appendTo($("#imagesdata"));
            id++;
        }
    }
    $(document).on('change', '#PaymentProof', function () {
        var fd = new FormData();
        // alert(JSON.stringify(s1));
        var j = 0;
        for (var i = 0; i < $("#PaymentProof").get(0).files.length; i++) {
            var filename = $("#PaymentProof").get(0).files[i].name;
            if (filename.endsWith(".jpg") || filename.endsWith(".jpeg") || filename.endsWith(".png") || filename.endsWith(".pdf") || filename.endsWith(".eml")) {
                fd.append("images" + i, $("#PaymentProof").get(0).files[i]);
                console.log(JSON.stringify(fd))
                console.log(fd)
            }
            else {
                j++;
                if ($("#PaymentProof").get(0).files.length == (j)) {
                    runError("unsupport format");
                    //$("label[for='msg']").text("unsupport format");
                    //$('#msgModal').show();
                }
            }
        }
        console.log(JSON.stringify(fd))
        console.log(fd)
        $.ajax({
            url: "/Transaction/UploadPhoto_Header?id=" + $("#txtiId").val() + "&&sPaymentProof=" + $("#PaymentProofs").val(),
            data: fd,
            type: "POST",
            contentType: false,
            processData: false,
            success: function (data, headers, status, config, files) {
                //$("#PaymentProofs").val(data)
                buildMenuPaymentProof(data);
            }
        });

        //$.ajax({
        //    url: "/Transaction/UploadPhoto__Header",
        //    data: fd,
        //    type: "POST",
        //    contentType: false,
        //    processData: false,
        //    success: function (data, headers, status, config, files) {
        //        imagesdata = [];
        //        imagesdata = data;
        //        // alert(JSON.stringify(filesdata[0]));
        //        $("#PaymentProof").val("");
        //        buildMenuPaymentProof(data);
        //    }
        //});
    });
    var indexpopup = 0;
    var l = 0;
    $(document).on('click', '#imagesdata img', function () {

        var s = $(this).attr('id');
        var h = "";
        var n = 0;
        if (s.length >= 8) {
            h = s[0] + s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7] + s[8];
        }
        //   alert(h);
        if (h == "viewPopup") {
            n = s.substring(9, s.length);
            var r = PaymentProofdata[parseInt(n)];
            $("#modalfile1").html("");
            var li = $('<img src="DeviationpathPaymentProof/?Id=' + new String(r) + '" style="height:300px; width:640px;" />');
            li.appendTo($("#modalfile1"));
            // alert(r.sName)
            $("label[for='Photoname1']").text(r.sName);
            indexpopup1 = n;
            $('#myModal1').show();
        }


        ///////////////delete
        //if (s.length >= 3) {
        //    h = s[0] + s[1] + s[2];
        //}
        //if (h == "img") {
        //    n = s.substring(3, s.length);
        //    var c = PaymentProofdata[parseInt(n)]
            
        //    $("label[for='msgph']").text("Do you want to delete image?");
        //    $("#modal-DeleteConfirmph").show();

        //}

    });
    $(document).on('click', '#imagesdata ul', function () {

        var s = $(this).attr('id');
        var h = "";
        var n = 0;
        //if (s.length >= 8) {
        //    h = s[0] + s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7] + s[8];
        //}
        ////   alert(h);
        //if (h == "viewPopup") {
        //    n = s.substring(9, s.length);
        //    var r = PaymentProofdata[parseInt(n)];
        //    $("#modalfile1").html("");
        //    var li = $('<img src="DeviationpathPaymentProof/?Id=' + new String(r) + '" style="height:300px; width:640px;" />');
        //    li.appendTo($("#modalfile1"));
        //    // alert(r.sName)
        //    $("label[for='Photoname1']").text(r.sName);
        //    indexpopup1 = n;
        //    $('#myModal1').show();
        //}


        ///////////////delete
        if (s.length >= 3) {
            h = s[0] + s[1] + s[2];
        }
        if (h == "img") {
            n = s.substring(3, s.length);
            var c = PaymentProofdata[parseInt(n)]
            iicount = parseInt(c.icount);
            iicountn = n;
            $("label[for='msgph']").text("Do you want to delete attachment?");
            $("#modal-DeleteConfirmph").show();

        }

    });
    $("#btnnoph").click(function () {
        $("#modal-DeleteConfirmph").hide();
    });
    $("#btncloseph").click(function () {
        $("#modal-DeleteConfirmph").hide();
    });
    $("#btnyesph").click(function () {
        $("#modal-DeleteConfirmph").hide();
        PaymentProofdata.splice(iicountn, 1);
         
        var imgs = '';
        $.each(PaymentProofdata, function () {
            imgs += this+ ',';
        });
        imgs = imgs.trimRight(1);
        buildMenuPaymentProof(imgs);
    })
    $("#btnclosefile1").click(function () {
        $('#myModal1').hide();

    })
    //////////////////this  ddds   back
    $(document).on('click', '#modalfile ul img', function () {
        var s = $(this).attr('id');
        var h = "";
        var n = 0;
        if (s.length >= 3) {
            h = s[0] + s[1] + s[2];
        }
        if (h == "img") {
            n = s.substring(3, s.length);
            $("#PhotoId").val(n)
            $("label[for='msgph']").text("Do you want to delete attachment?");
            $("#modal-DeleteConfirmph").show();
        }

        $("label[for='msgph1']").text("Do you want to delete attachment?");
        $("#modal-DeleteConfirmph1").show();
    });
    $("#btnnoph1").click(function () {
        $("#modal-DeleteConfirmph1").hide();
    });
    $("#btncloseph1").click(function () {
        $("#modal-DeleteConfirmph1").hide();
    });
    $("#btnyesph1").click(function () {
        $("#modal-DeleteConfirmph1").hide();
        Imagesdata.splice($("#PhotoId").val(), 1);

        var imgs = '';
        $.each(Imagesdata, function () {
            imgs += this + ',';
        });
        imgs = imgs.trimRight(1);
        imgs = (imgs).replace(/,\s*$/, "");
        imgs = (imgs).replace(/^,/, "");
        $("#sAttachment" + s).val(imgs);

        if (imgs == '') {
            count1len = 0;
        }
        else {
            count1 = (imgs).split(",");
            count1len = count1.length;
        }

        $("#count" + s).val(count1len)
        buildMenu(imgs);
    })
    $.ajax({
        url: '/Home/GetExchangeRate/',
        data: { search: "" },
        success: function (data) {
            ExcRate = data;
            buildViewsExcRate(data);

        }
    });
    function buildViewsExcRate(items) {
        var id = 0;

        $.each(items, function () {

            var li = new Option(this.sName, this.fExcRate);
            $(li).html(this.sName);
            $("#excrate").append(li)

        });
        $('select option:contains("AED")').prop('selected', true);
        $("#ExcRaterSelect-Rate").val($("#excrate").find("option:selected").val());
        $("#ExcRateSelect").val($("#excrate").find("option:selected").text());
    }
    //////////////Approve/Reject
    $("#btnApprove").click(function () {
        //if (row_selected.length > 0) {
        deletetype = 1;
        $("label[for='msg']").text("Do you want to Approve Row?");
        $("#modal-Apv-Rjt").show();
        //}
        //else {
        //    runError("Please select checkbox");
        //}
    });
    $("#btnApv").click(function () {
        //      $("#modal-Apv-Rjt").hide();
        $("#loaddata").show();
        $("#nonloaddata").hide();
        if (parseInt($("#txtiLevel").val()) == 4) {
            type = 2;
            //  alert("ok")
            $("#btnsave").click();
        }
        else {
            $.ajax({
                url: '/Transaction/Approve_Trans',
                data: {  ids:  $("#txtiId").val(), iLevel:parseInt($("#txtiLevel").val()), status: 1, remarks: '' },
                success: function (data) {
             
                    $("#loaddata").hide();
                    $("#nonloaddata").show();
                    runsuccess(data + "..!!!", "/Transaction/TransApproveSummary");
                }

          
            });  }
    })
    $("#btnRjt").click(function () {
        $("#modal-Apv-Rjt").hide();
        $("#modal-Remarks").show();
    })
    $("#btncloseAR").click(function () {
        $("#modal-Apv-Rjt").hide();

    })

    ////////////////////sRemarks adding


    $("#btnRjtSave").click(function () {
        $("#loaddata").show();
        $("#nonloaddata").hide();
        $("#modal-Remarks").hide();
        $.ajax({
            url: '/Transaction/Approve_Trans',
            data: { ids: $("#txtiId").val(), iLevel:parseInt($("#txtiLevel").val()), status: 2, remarks: $("#sRemarks").val() },
            success: function (data) {
                $("#loaddata").hide();
                $("#nonloaddata").show();
                runsuccess(data + "..!!!", "/Transaction/TransApproveSummary");

            }
        });
       
    })
    $("#btnRjtCancel").click(function () {
        $("#modal-Remarks").hide();

    })
    $("#btncloseRemarks").click(function () {
        $("#modal-Remarks").hide();

    })

    //////////////////////////GridLoad  option
    $("#btnnewbody").click(function () {
        if ($("#CompanySelect").val() == '') {
            runError("Please select company")
        }
        else if ($("#VendorSelect").val() == '') {
            runError("Please select Vendor")
        }
        else {
            $("#modal-Grid").show();
            //  getGrid();
            buildGrid(Griddata)
            body_selected = [];
            if (MainBody.length > 0) {

                tlamount = 0;
                for (var i = 0; i < MainBody.length; i++) {
                    for (var j = 0; j < Griddata.length; j++) {
                        if (MainBody[i].RefId == Griddata[j].RefId) {
                            $('#bodygrid td #' + Griddata[j].id + '').prop('checked', true);
                            tlamount = parseFloat(tlamount) + parseFloat(MainBody[i].fAmount);
                            body_selected.push(Griddata[j])
                        }
                    }
                }
                $("label[for='totalamount']").text(tlamount);
            }
        }
    })

    
    function buildGrid(items) {
        var rowNo = 0;
        Griddata = [];
        $("#bodygrid").html("");
        Griddata = items;
        if (items.length == 0) {
            var li = $('<tr id="' + rowNo + '"style="background-color:#ffffff;font-weight:bold"><td style="min-width:641.6px;"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;height: 20px; width:120px;">No Data found</label></td></tr>');
            li.appendTo("#bodygrid");
        } else {
            $.each(items, function () {
                var li = $('<tr id="tr' + rowNo + '"style="border: 1px solid black;text-align:center;font-weight:400;font-size: 13px;"><td style="border: 1px solid black;font-weight:400;font-size: 13px;"><input style="height: 12px;width:12px;" type="checkbox"  id=' + this.id+ ' value="sId" /></td><td style="border: 1px solid black;font-weight:400;font-size: 13px;" hidden>' + this.RefId + '</td><td style="border: 1px solid black;font-weight:400;font-size: 13px;">' + this.DocNo + '</td><td style="border: 1px solid black;font-weight:400;font-size: 13px;">' + this.DocDate + '</td><td style="border: 1px solid black;font-weight:400;font-size: 13px;padding:0px;">' + this.DueDate + '</td><td style="border: 1px solid black;font-weight:400;font-size: 13px;">' + this.BillAmount + '</td><td style="border: 1px solid black;font-weight:400;font-size: 13px;"><input type="number" style="font-weight:400;font-size: 13px;width:100px" id="Amount' + rowNo + '" onchange="changeAmount(' + rowNo + ')"  value="' + this.Amount + '"></td></tr>');
                li.appendTo("#bodygrid");
                rowNo++;
            });

        }
    }
 
    function getGrid() {
        tlamount = 0;
        $.ajax({
            url: '/Transaction/GetPendingBills',
            data: { CId: parseInt($("#CompanySelect-id").val()), VId: parseInt($("#VendorSelect-id").val()) },
            method: 'get',
            dataType: 'json',
            success: function (data) {
                // Griddata = data;
                buildGrid(data);
            },
            error: function (err) {
            }
        });
        
    }
    //   var MainBody = [];
    tlamount = 0;
    $('#bodygrid').on('change', 'input[type=checkbox]', function (event) {
        var iAct = $(this).attr('id');
        //alert(iAct);
        var irow = $(this).closest('tr').attr('id');
        irow = irow.substring(2, irow.length);
        if ($(this).prop("checked") == true) {
            body_selected.push(Griddata[irow]);
            tlamount = parseFloat( tlamount )+  parseFloat(Griddata[irow].Amount);
        }
        else if ($(this).prop("checked") == false) {
            var index = 0;
            $.each(body_selected, function (value2, key2) {
                if (body_selected.length > index) {
                    //body_selected.splice(, 1);

                    if (iAct == key2.id) {
                        body_selected.splice(index, 1);
                           
                    }
                }
                index++;
            });

            tlamount = parseFloat(tlamount )- parseFloat(Griddata[irow].Amount);

        }
        if ($("#bodygrid td input[type=checkBox]:checked").length == $("#bodygrid td input[type=checkBox]").length) {
            $("#tblGrid #selectall").prop('checked', true);
        }
        else {
            $("#tblGrid #selectall").prop('checked', false);
        }
       
        $("label[for='totalamount']").text(tlamount);

    });

    $('#tblGrid').on('change', 'input[type=checkbox]', function (event) {
 
        var iAct = $(this).attr('id');
        // alert(iAct);
        if (iAct == "selectall") {
            tlamount = 0;
            if ($(this).prop("checked") == true) {
               
                // $.each(Griddata, function () {
                $('#bodygrid td input[type="checkbox"]').prop('checked', true);
                body_selected = Griddata;
                $.each(body_selected, function (value2, key2) {
                    tlamount = parseFloat(tlamount )+ parseFloat(key2.Amount);
                });

                // });
            }
            else if ($(this).prop("checked") == false) {
                $('#bodygrid td input[type="checkbox"]').prop('checked', false);
                body_selected = [];
                tlamount = 0;

            }
        }
      
        if ($("#bodygrid td input[type=checkBox]:checked").length == $("#bodygrid td input[type=checkBox]").length) {
            $("#tblGrid #selectall").prop('checked', true);
        }
        else {
            $("#tblGrid #selectall").prop('checked', false);
        }
        $("label[for='totalamount']").text(tlamount);
    });

    $('#GriddataLoad').click(function () {
       
        MainBody = [];
        for (var i = 0; i < body_selected.length; i++) {
            MainBody_list = { RefId: body_selected[i].RefId, focusdoc: body_selected[i].focusdoc, sInvoiceNo: body_selected[i].DocNo, iInvoiceDate: body_selected[i].DocDate, iInvoiceDueDate: body_selected[i].DueDate, creditdays: body_selected[i].creditdays, currency: body_selected[i].currency, fAmount: body_selected[i].Amount, BillAmount: body_selected[i].BillAmount, EntityId: body_selected[i].EntityId, Entity: body_selected[i].Entity, CostCenterId: body_selected[i].CostCenterId, CostCenter: body_selected[i].CostCenter, TradeNoId: body_selected[i].TradeNoId, TradeNo: body_selected[i].TradeNo, SubTradeNoId: body_selected[i].SubTradeNoId, SubTradeNo: body_selected[i].SubTradeNo, DivisionId: body_selected[i].DivisionId, Division: body_selected[i].Division, sRemarks: "", sInvoiceRef: "", sAttachment: "" };
            MainBody.push(MainBody_list);
        }
        build_bodynew(MainBody);
        $("#modal-Grid").hide();
        tlamount = 0;
        $("label[for='totalamount']").text(tlamount);
        body_selected = [];
    })
    function build_bodynew(items) {
        Main_body_de = [];
        //alert(JSON.stringify(items))
        var id = $("#binddata").find("tr").last().attr('id');
        //if (id == undefined) {
        //    id = 0;
        //}
        //else
        //{
        //    id++;
        //}
        id = 0;
        var li = $('');
        $("#binddata").html("");
        //li.appendTo($("#binddata"));
        var famt = 0;
        var id = 0;
        $.each(items, function () {
            var count1len = 0, count2len = 0;
            var count1 = 0;
            if (this.sAttachment == "" || this.sAttachment == null) {
                count1len = 0;
            }
            else {
                this.sAttachment = (this.sAttachment).replace(/,\s*$/, "");
                this.sAttachment = (this.sAttachment).replace(/^,/, "");
                count1 = (this.sAttachment).split(",");
                count1len = count1.length;
            }

            // var sAttachment = "";
            var li = $('<tr  id=' + id + ' ><td><input style="height: 12px; width:12px;" type="checkbox"  id=' + this.RefId + ' value="sId" /><input type="hidden" id="RefId' + id + '" value=' + this.RefId + '></td><td><input type="text" readonly class="form-control" id="focusdoc' + id + '" autofocus autocomplete="off" value=' + this.focusdoc + ' /></td><td><input type="text" readonly class="form-control" id="sInvoiceNo' + id + '" autofocus autocomplete="off" value=' + this.sInvoiceNo + ' /></td><td><input type="text" class="form-control" id="iInvoiceDate' + id + '" readonly value=' + this.iInvoiceDate + ' /></td><td><input type="text" class="form-control" id="iInvoiceDueDate' + id + '" readonly value=' + this.iInvoiceDueDate + ' /></td><td><input type="text" readonly class="form-control" id="creditdays' + id + '" autofocus autocomplete="off" value=' + this.creditdays + ' /></td><td><input type="text" readonly class="form-control" id="currency' + id + '" autofocus autocomplete="off" value=' + this.currency + ' /></td><td><input type="number" class="form-control" id="fAmount' + id + '" autofocus autocomplete="off" value=' + this.fAmount + ' onchange="changeBodyAmount(' + id + ')"/></td><td id="sAttachments"> <input class="letter" id="sAttachments' + id + '" type="file" aria-label="Add photos to your post" name="images" multiple="" accept=".jpg,.jpeg,.png,.pdf,.eml"><input type="hidden" id="sAttachment' + id + '" value="' + this.sAttachment + '"></td><td><input type="text" style="width:20px" readonly id="count' + id + '" value=' + count1len + ' class="form-control"></td><td><i  id="sAttachment" class="fa fa-image float-right" style="padding-top:4.4px;"><i></td><td><input class="ui-autocomplete-input form-control"  readonly type="text" id="EntitySelect' + id + '"  autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" value=' + this.Entity + '><input type="hidden" id="EntitySelect' + id + '-id" value=' + this.EntityId + '/></td><td><input class="ui-autocomplete-input form-control" type="text" id="CostCenterSelect' + id + '"  readonly  autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" value=' + this.CostCenter + '><input type="hidden" id="CostCenterSelect' + id + '-id" value=' + this.CostCenterId + '/></td><td><input class="ui-autocomplete-input form-control" type="text" readonly id="TradeNoSelect' + id + '"  autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" value=' + this.TradeNo + '><input type="hidden" id="TradeNoSelect' + id + '-id" value=' + this.TradeNoId + ' /></td><td><input class="ui-autocomplete-input form-control" type="text" readonly id="SubTradeNoSelect' + id + '"   autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" value=' + this.SubTradeNo + '><input type="hidden" id="SubTradeNoSelect' + id + '-id" value=' + this.SubTradeNoId + '/></td><td><input class="ui-autocomplete-input form-control" type="text" readonly id="DivisionSelect' + id + '"  autocomplete="off" role="textbox" aria-autocomplete="list" aria-haspopup="true" value=' + this.Division + '><input type="hidden" id="DivisionSelect' + id + '-id" value=' + this.DivisionId + '/></td><td><input type="text" class="form-control" id="sRemarks' + id + '"  autofocus autocomplete="off" value=' + this.sRemarks + '></td><td><input type="text" class="form-control" id="sInvoiceRef' + id + '"  autofocus autocomplete="off" value=' + this.sInvoiceRef + '></td>');
            li.appendTo($("#binddata"));
            famt = parseFloat( famt) +parseFloat( this.fAmount);
            $('#totalAmt').text(famt.toFixed(3));
            id++;
        }); 
    }
    $('#btncloseGrid').click(function () {
        $("#modal-Grid").hide();
    })
    $("#VendorSelect-id").on('change',function ()
    {
        $("#BeneficiarySelect-id").val($("#VendorSelect-id").val());
        $("#BeneficiarySelect").val($("#VendorSelect").val());
        getGrid();

    })



    ////////////////Prin 
    $('#TransPrintModal').modal('hide');


    $('#btnPrint').click(function (evt) {
        
        //if ($("#txtLevel").val() == 3) {
        //    var options = '<option  value=1 >Payment Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        //else if ($("#txtLevel").val() == 4) {
        //    var options = '<option  value=1 >Payment Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //    var options = '<option  value=2 >Payment Summary Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        //else {
        //    var options = '<option  value=1 >Remittance Advice</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        var slayout = '';
        if (parseInt($("#txtiApproved").val()) == 1) {
            slayout = 'Remittance Advice';
        } else {
            if (parseInt($("#txtiLevel").val()) == 3) {
                slayout = 'Payment Request';
            }
            else if (parseInt($("#txtiLevel").val()) == 4) {
                slayout = 'Payment Request';
            }
        }
        iTransId=parseInt($("#txtiId").val());
        if (iTransId > 0 && slayout!='') {

            $.ajax({
                url: '/Transaction/ExportToPDF/',
                data: { slayout: slayout,iTransId: iTransId},
                type: 'GET',
                //contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    $('#frmPDF').attr('src', '/' + result);

                    setTimeout(function () {
                        frame = document.getElementById("frmPDF");
                        framedoc = frame.contentWindow;
                        framedoc.focus();
                        framedoc.print();
                    }, 1000);

                    //  $('#TransPrintModal').modal('hide');
                    //     $('#printloader').addClass('d-none');
                },
                error: function (xhr, status, err) {
                    runError(err);
                }
            });
        }
        else {
            runError("Not Available in this Level")
        }
    });
    $('#btnPrint1').click(function (evt) {

        //if ($("#txtLevel").val() == 3) {
        //    var options = '<option  value=1 >Payment Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        //else if ($("#txtLevel").val() == 4) {
        //    var options = '<option  value=1 >Payment Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //    var options = '<option  value=2 >Payment Summary Request</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        //else {
        //    var options = '<option  value=1 >Remittance Advice</option>';
        //    $(options).appendTo($('#PrintLayout'));
        //}
        var slayout = '';
        if (parseInt($("#txtiApproved").val()) == 1) {
            slayout = 'Remittance Advice';
        } else {
            if (parseInt($("#txtiLevel").val()) == 3) {
                slayout = 'Payment Request';
            }
            else if (parseInt($("#txtiLevel").val()) == 4) {
                slayout = 'Payment Request';
            }
        }
        iTransId = parseInt($("#txtiId").val());
        if (iTransId > 0 && slayout != '') {

            $.ajax({
                url: '/Transaction/ExportToPDF/',
                data: { slayout: slayout, iTransId: iTransId },
                type: 'GET',
                //contentType: 'application/json; charset=utf-8',
                success: function (result) {
                    $('#frmPDF').attr('src', '/' + result);

                    setTimeout(function () {
                        frame = document.getElementById("frmPDF");
                        framedoc = frame.contentWindow;
                        framedoc.focus();
                        framedoc.print();
                    }, 1000);

                    //  $('#TransPrintModal').modal('hide');
                    //     $('#printloader').addClass('d-none');
                },
                error: function (xhr, status, err) {
                    runError(err);
                }
            });
        }
        else {
            runError("Not Available in this Level")
        }
    });
    //function PrintVoucher(iTransId, iAction) {
      
    //}
  
});
function GetValue(excrate) {
    $("#ExcRaterSelect-Rate").val(excrate.value);
    $("#ExcRateSelect").val($(excrate).find("option:selected").text());
}


function changeAmount(id) {
     var amount = ($("#Amount" + id).val());
    if (amount <= Griddata[id].BillAmount) {
        Griddata[id].Amount = amount;
        if (MainBody.length > 0) {
            tlamount = 0;
            for (var i = 0; i < body_selected.length; i++) {
                if (Griddata[id].RefId == body_selected[i].RefId) {
                   body_selected[i].Amount = amount;
                }
                tlamount = parseFloat(tlamount) + parseFloat(body_selected[i].Amount);
            }
        }
        $("label[for='totalamount']").text(tlamount);
    }
    else {
        $("#Amount" + id).val(Griddata[id].Amount);
        runError("Amount always less than bill amount");
    }
}


function changeBodyAmount(id) {
    var amount = ($("#fAmount" + id).val());
    if (amount <= MainBody[id].BillAmount) {
         MainBody[id].fAmount = amount;
       //    tlamount = 0;
         for (var i = 0; i < Griddata.length; i++) {
               if (Griddata[i].RefId == MainBody[id].RefId) {

                   Griddata[i].Amount = amount;
               }
              // tlamount = parseFloat(tlamount) + parseFloat(MainBody[id].Amount);
         }
         tlamount = 0;
         for (var i = 0; i < MainBody.length; i++) {
             tlamount = parseFloat(tlamount) + parseFloat(MainBody[i].fAmount);
         }
         $("label[for='totalamount']").text(tlamount);
         $('#totalAmt').text(tlamount.toFixed(3));
     }
    else {
        $("#Amount" + id).val(Griddata[id].Amount);
        runError("Amount always less than bill amount");
    }
}


function onClickPrint(evt) {
    //var iPrint = $('#PrintLayout').val();


    //$('#printloader').removeClass('d-none');
    //if (iPrint > 0) {

    $.ajax({
        url: '/Transaction/ExportToPDF/',
        //data: { iPrint: iPrint },
        type: 'GET',
        //contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#frmPDF').attr('src', '/' + result);

            setTimeout(function () {
                frame = document.getElementById("frmPDF");
                framedoc = frame.contentWindow;
                framedoc.focus();
                framedoc.print();
            }, 1000);

            //  $('#TransPrintModal').modal('hide');
            //     $('#printloader').addClass('d-none');
        },
        error: function (xhr, status, err) {
            runError(err);
        }
    });
    //}
    //else {
    //    $('#printloader').addClass('d-none');
    //    runError("Choose any layout and click..!!");
    //}
}

function onClickPrintPreview(evt) {
    onClickPrint();
    // $('#preloader').fadeOut(10500);
    var iPrint = $('#PrintLayout').val();
    $('#TransPrintPreviewModal').find("div.modal-body").html("");
    if (iPrint > 0) {
        $('#TransPrintModal').modal('hide');
        var res = "/Trans/_TransPrint?iPrint=" + iPrint + "";
        $('#TransPrintPreviewModal').find("div.modal-body").load(res);
        $('#TransPrintPreviewModal').modal('show');
        $('#preloader').hide();
    }
    else {

        runError("Choose any layout and click..!!");
        $('#preloader').fadeOut(1500);

    }

}

