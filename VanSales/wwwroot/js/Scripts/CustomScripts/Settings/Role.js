var mainTableList = [];
var userid = $("#hdn_SessionUID").val();
if (userid == 0) {
    redirectToLogin();
}

var viewsScreens_selected = [];
var screens = [];
var mainTableList = [];

const elementMapping = { //post,getdetail,clearfields
    "hdn_iId": "iRoleId",
    "txtname": "sRoleName",
    "hdn_SessionUID": "iUser",
    "RoleDetails": viewsScreens_selected
};

function clearFields() {
    mainTableList = [];
    userType_selected = [];
    $("#hdn_iId").val(0);
    $("#btnPost").prop("disabled", false);
    $('#ViewsEntitydatas input[type="checkbox"]').prop('checked', false);    
    const excludedFieldIds = ['hdn_SessionUID','RoleDetails'];
    for (const elementId in elementMapping) {
        if (!excludedFieldIds.includes(elementId)) {
            $(`#${elementId}`).val("");
        }
    }
    $("#Role-id").val(0);
}

$("#btnPost").click(function () {


    mainTableList = [];
    $('#roleSummaryTable input[type="checkbox"]').prop('checked', false);

    const fieldsToValidate = [
        { fieldId: "txtname", errorMessage: "Role is required" },
        { fieldId: "RoleDetails", errorMessage: "Please select any screens" },
    ];
    let postFlag = true;

    const excludedFieldIds = ['RoleDetails'];
    for (const fieldInfo of fieldsToValidate) {
        if (!excludedFieldIds.includes(fieldInfo.fieldId)) {
            const fieldValue = $("#" + fieldInfo.fieldId).val();
            if (fieldValue.trim() === "") {
                postFlag = false;
                runError(fieldInfo.errorMessage);
                break; // Stop validation on the first error
            }
        } else// if (fieldInfo.fieldId == "RoleDetails") 
          {
            if (viewsScreens_selected.length==0) {
                postFlag = false;
                runError(fieldInfo.errorMessage);
                break; // Stop validation on the first error
            }
        }
    }
        if (postFlag) {
            $("#btnPost").prop("disabled", true);
            iId = $("#hdn_iId").val();

            var roleDetails = {};
            //const fieldToExclude = 'fieldIdToExclude';
            //if (fieldId !== fieldToExclude) { // Check if the current fieldId is not the one you want to exclude
            const excludedFieldIds = ['RoleDetails'];
            for (const fieldId in elementMapping) {
                if (!excludedFieldIds.includes(fieldId)) {
                    const fieldName = elementMapping[fieldId];
                    roleDetails[fieldName] = $("#" + fieldId).val().trim();
                } else {
                    const fieldName = elementMapping[fieldId]; // Get the fieldName for the excluded field
                    roleDetails[fieldName] = viewsScreens_selected;
                }
            }

            console.log("OutletDetails Post", roleDetails);
            var sroleDetails = JSON.stringify(roleDetails);
            $.ajax({
                url: '/Master/Post',
                type: 'POST',
                data: {
                    'obj': sroleDetails,
                    'sAPIName': 'PostRole',
                },
                success: handleAjaxSuccess,
                error: handleAjaxError
            });
        }

});


function handleAjaxSuccess(data) {
    // Handle the success response here
    alert("in handleAjaxSuccess: "+data)
    console.log("Success:", data);
    const msgResponse = data.response;
    if (msgResponse === "Inserted successfully" || msgResponse === "Updated successfully") {
        runSuccess(msgResponse);
        $("#GetMasterList").hide();
    } else {
        runError("Something went wrong");
    }
    reloadDatatable();
    $("#btnPost").prop("disabled", false);
}

function handleAjaxError(error) {
    // Handle any errors that occur during the AJAX request
    console.error("Error in AJAX request:", error);
    $("#btnPost").prop("disabled", false);
}




function loadScreens() {
    $.ajax({
        url: '/Attendance/GetScreens',
        method: 'get',
        data: { sAPIName: "GetScreen" },
        dataType: 'json',
        success: function (data) {
            data = data.ResultData;
            // alert("loadScreens data" + JSON.stringify(data));
            screens = JSON.parse(data);
            buildViewsScreens(screens);

        }
    });
}

function buildViewsScreens(items) {
    //alert(items.length);
    //alert("_type" + _type);
    var id = 0;
    $("#ViewsEntitydata").html("");
    $("#ViewsEntitydatas").html("");
    if (items.length <= 0) {
        var li = $('<div class="col-lg-12" id="ViewsEntitydata" style="overflow:auto; width:100%;max-height:200px;">');
        li.appendTo($("#ViewsEntitydatas"));
        var li = $('<ul class="col-lg-12" style="margin-top:-5px" id="ul_No"><li id="li_No" style="height:15px;list-style-type:none;display:block;padding:0px;"><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;padding-left:5px;">No Data</label></li></ul>');
        li.appendTo($("#ViewsEntitydata"));
    }
    else {

        //var li = $('<span style="height:2px;padding-left:100px"><input style="height: 10px; width:10px;" type="checkbox"  id="selectall" /><label style="height:2px;font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;padding-left:5px">Select All</label></span><div class="col-lg-12" id="ViewsEntitydata" style="overflow:auto; width:100%;max-height:199px;">');
        //li.appendTo($("#ViewsEntitydatas"));
        var li = $('<span style="height:2px;padding-left:150px" id="span_search"><input style="height: 25px; width:100px;position:absolute;right:72px" type="text" placeholder="Search" id="searchCompany" /> <button style="background-color: white;height:30px;padding-top:0px;padding-right:10px;border:none;position:absolute;left:130px" id="searchCompanydata"><i class="zmdi zmdi-search"></i></button><input style="height: 10px; width:15px;" type="checkbox"  id="selectall" /><label style="height:2px;font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;padding-left:5px">Select All</label></span><div class="col-lg-12" id="ViewsEntitydata" style="overflow:auto; width:100%;max-height:199px;">');
        li.appendTo($("#ViewsEntitydatas"));
        // alert("hmmmm..."+li)
        $.each(items, function () {

            var li = $('<ul class="col-lg-12" style="margin-top:-5px" id="ul' + this.iId + '"><li id="li' + this.iId + '" style="height:15px;list-style-type:none;display:block;padding:0px;"><input style="height: 10px; width:10px;" type="checkbox"  id=' + this.iId + ' value="sId" /><label style="font-weight:400;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,sans-serif;font-size: 13px;padding-left:5px;">' + this.sName + '</label></li></ul>');
            li.appendTo($("#ViewsEntitydata"));
            id++;
            //var k = { "iId": this.iId };
            //viewsScreens_selected.push(k);

        });

        $("#searchCompanydata").click(function (e) {
            var filteredCompany = $(items).filter(function (idx) {
                return (items[idx].sName).toLowerCase().startsWith(($("#searchCompany").val().toLowerCase()));
            });
            if (filteredCompany.length > 0) {
                var c = $('#ViewsEntitydata')
                var k = $('#ViewsEntitydata #ul' + filteredCompany[0].iId)

                var p = k.offset().top - c.offset().top + c.scrollTop();
                //p = p + 205;
                c.scrollTop(p);
            }
        });

        if (viewsScreens_selected.length > 0) {
            //alert("edit list "+JSON.stringify(viewsScreens_selected));
            $.each(viewsScreens_selected, function () {
                $('#ViewsEntitydata input[type="checkbox"]' + '#' + this.iScreenId).prop('checked', true);
            });
            //alert($("#ViewsEntitydata ul input[type=checkBox]:checked").length)
            if ($("#ViewsEntitydata ul input[type=checkBox]:checked").length == $("#ViewsEntitydata ul input[type=checkBox]").length) {
                $("#selectall").prop('checked', true);
            }
            else {
                $("#ViewsEntitydatas #selectall").prop('checked', false);
            }
        }
    }
    // $("#please-wait").css("display", "none")    
}

$('#ViewsEntitydatas').on('change', 'input[type=checkbox]', function (event) {

    var iAct = $(this).attr('id');
    if (iAct == "selectall") {
        if ($(this).prop("checked") == true) {
            viewsScreens_selected = [];
            $.each(screens, function () {
                var k = { "iScreenId": this.iId };
                //var k = { "iScreen": this.iId };
                $('#ViewsEntitydata input[type="checkbox"]').prop('checked', true);
                viewsScreens_selected.push(k);
            });
        }
        else if ($(this).prop("checked") == false) {
            $('#ViewsEntitydata input[type="checkbox"]').prop('checked', false);
            viewsScreens_selected = [];
        }
    }
    else {
        if ($(this).prop("checked") == true) {
            var k = { "iScreenId": iAct };
            viewsScreens_selected.push(k);
        }
        else if ($(this).prop("checked") == false) {
            var index = 0;
            $.each(viewsScreens_selected, function (value2, key2) {
                if (viewsScreens_selected.length > index) {
                    if (iAct == key2.iScreenId) {
                        viewsScreens_selected.splice(index, 1);
                    }
                }
                index++;
            });
        }
        //alert($("#ViewsEntitydata ul input[type=checkBox]:checked").length)
        if ($("#ViewsEntitydata ul input[type=checkBox]:checked").length == $("#ViewsEntitydata ul input[type=checkBox]").length) {
            $("#selectall").prop('checked', true);
        }
        else {
            $("#selectall").prop('checked', false);
        }
    }
    //if ($("#hdn_iAvailabe").val() == 1) {
    //    $("label[for='msgDuplicateName']").text("Existing Company(s):");
    //    $("label[for='msgCompanyNames']").text(sNames);
    //}

});
