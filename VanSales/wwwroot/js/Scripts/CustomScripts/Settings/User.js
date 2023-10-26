

var mainTableList = [];
var userid = $("#hdn_SessionUID").val();
if (userid == 0) {
    redirectToLogin();
}

const elementMapping = { //post,getdetail,clearfields
    "hdn_iId": "iId",
    "txtuname": "UserName",
    "txtlogname": "LoginName",
    "txtpswd": "Password",
    "Role": "sRole",
    "Role-id": "iRole",
    "txtmobile": "Phone",
    "txtemail": "Email",
   "hdn_SessionUID":"iUser"   
};

function handleNewButtonClick() {
    newMode();
}
$("#btnNew").click(handleNewButtonClick);
$("#btnNewPopup").click(handleNewButtonClick);

function newMode() {
    if (userid == 0) {
        redirectToLogin();
    } else {
        type = 1;
        clearFields();
        $("#GetMasterList").show();
    }
}

function clearFields() {
    mainTableList = [];   
    userType_selected = [];
    $("#hdn_iId").val(0);
    $("#btnPost").prop("disabled", false);
    $('#ViewsUserType input[type="checkbox"]').prop('checked', false);  
    for (const elementId in elementMapping) {        
        $(`#${elementId}`).val("");
    }
    $("#Role-id").val(0);
}

$("#btnPost").click(function () {

    if ($('#Role').val() == "") {
        $('#Role-id').val(0);
    }

    mainTableList = [];
    $('#outletSummaryTable input[type="checkbox"]').prop('checked', false);

    const fieldsToValidate = [
        { fieldId: "txtuname", errorMessage: "UserName is required" },
        { fieldId: "txtlogname", errorMessage: "LoginName is required" },
        { fieldId: "txtpswd", errorMessage: "Password is required" },
      
        { fieldId: "txtmobile", errorMessage: "Mobile is required" },
        { fieldId: "txtemail", errorMessage: "Email is required" },
        { fieldId: "Role", errorMessage: "Role is required" },
        { fieldId: "SalesMen", errorMessage: "SalesMen is required" },
    ];
    let postFlag = true;
    for (const fieldInfo of fieldsToValidate) {
        const fieldValue = $("#" + fieldInfo.fieldId).val();
        if (fieldValue.trim() === "") {
            postFlag = false;
            runError(fieldInfo.errorMessage);
            break; // Stop validation on the first error
        }
    }    

    if (postFlag) {
        $("#btnPost").prop("disabled", true);
        iId = $("#hdn_iId").val();
        
        var UserDetails = {};
        //const fieldToExclude = 'fieldIdToExclude';
        //if (fieldId !== fieldToExclude) { // Check if the current fieldId is not the one you want to exclude
        const excludedFieldIds = ['fieldId1', 'fieldId2', 'fieldId3']; // Replace these with the fieldIds you want to exclude
        for (const fieldId in elementMapping) {
            if (!excludedFieldIds.includes(fieldId)) { // Check if the current fieldId is not in the excluded list
                const fieldName = elementMapping[fieldId];
                UserDetails[fieldName] = $("#" + fieldId).val().trim();
            }
        }

        console.log("OutletDetails Post", UserDetails);
        var sUserDetails = JSON.stringify(UserDetails);
        $.ajax({
            url: '/Master/Post',
            type: 'POST',
            data: {
                'obj': sUserDetails,
                'sAPIName': 'PostUser',
            },
            success: handleAjaxSuccess,
            error: handleAjaxError
        });
    }

});


function handleAjaxSuccess(data) {
    // Handle the success response here
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







