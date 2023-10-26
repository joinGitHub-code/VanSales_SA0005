
var userid = $("#hdn_SessionUID").val();
function postMasterDetails(obj, sAPIName) {
    $.ajax({
        url: '/Master/Post',
        //url: '/Master/PostRequest',
        type: 'POST',
        data: {
            //'relativeUrl': sAPIName,       
            //'jsonContent': obj,
            obj: obj,
            sAPIName: sAPIName
        },
        success: function (res) {
            handleAjaxSuccess(res);
        },
        error: function (data) {
            handleAjaxError(data);
        }
    });
}

function newMode() {
    if (userid == 0) {
        redirectToLogin();
    } else {
        type = 1;
        clearFields();
        $("#GetMasterList").show();
    }

}

function copyValue() {
    var hdn_iIdValue = document.getElementById('hdn_iId').value;    
    return hdn_iIdValue;
}
function getMenuValue() {
    return "0";
}
// A reusable function for handling double clicks and button clicks
function handleDoubleClickOrButtonClick(sAPIName,rowData) {

   
    if (userid === 0) {
        redirectToLogin();
    } else {
        if (rowData) {
            var chkId = rowData.iId;
            mainTableList.push(rowData);
            $("#hdn_iId").val(chkId);
            getMasterDetails(sAPIName, chkId);
        } else {
            runError("Please Select Any Checkbox");
        }
    }
}

// Centralized function for fetching Master details
function getMasterDetails(sAPIName, iId) {   
    var querParameter = {
            
        iId: iId,
        iMaster:0
    }
    $("#hdn_iId").val(iId);
    $.ajax({
        url: "/Master/GetDetails",
        //data: {
        //    sAPIName: sAPIName,
        //    iId: iId,
        //},
        data: {
            sAPIName: sAPIName,
            queryParameters: querParameter
        },
        method: 'get',
        success: function (data) {
            console.log("Edit:", data);
            clearFields();
            $("#GetMasterList").show();
            GetDetails(data);
        },
        error: function (error) {
            console.error("iId:", iId);
            console.error("Error in getMasterDetails ():", error);
        },
    });
}


// Common function to handle redirecting to the login page.
function redirectToLogin() {
    window.location = "/Main/Login";
}



$("#btnClosePopup").click(function () {
    $("#GetMasterList").hide();
    mainTableList = [];
    $('#SummaryTable input[type="checkbox"]').prop('checked', false);

});

$("#btnClose").click(function () {
    if (userid == 0) {
        redirectToLogin();
    } else {
        window.location = '/Main/Index';
    }
});

function deleteConfirm() {
    if (userid === 0) {
        redirectToLogin();
    } else {
        $("#btnSummaryDelete").prop("disabled", true);
        if (mainTableList.length > 0) {            
            $("label[for='msg']").text(`Do you want to delete '${mainTableList.length}' row${mainTableList.length > 1 ? 's' : ''}?`);
            $("#modal-DeleteConfirm").show();
        } else {
            $("#btnSummaryDelete").prop("disabled", false);
            runError("Please Select Any Checkbox");
        }
    }
}

function deleteMasters(sAPIName, userid) {
    if (userid == 0) {
        redirectToLogin();
    } else {
        // Use a more modern approach like arrow functions and template literals
        const ids = mainTableList.map(item => item.iId).join(',');
        // Optionally trim trailing comma
        const trimmedIds = ids.endsWith(',') ? ids.slice(0, -1) : ids;

        //OR
        //const ids = mainTableList.map(item => item.iId).join(',');
        //// Optionally trim trailing comma
        //if (ids.endsWith(',')) {
        //    ids = ids.slice(0, -1);
        //}

        // Use the fetch API for the AJAX request, which is more modern and returns a Promise

        //fetch(`/Master/Delete?sAPIName=${sAPIName}&iId=${trimmedIds}&iUser=${userid}`, {
        //    method: 'GET',
        //})
        //    .then(response => {
        //        console.error('iIds:', trimmedIds);
        //        if (!response.ok) {
        //            throw new Error('Network response was not ok');
        //        }
        //        return response.json();
        //    })
        //    .then(data => {
        //        console.error('iIds:', trimmedIds);
        //        const sResultData = data.ResultData;
        //        //alert("sResultData: " + sResultData);
        //        const sMessageDescription = data.MessageDescription;

        //        if (parseInt(sResultData) > 0) {
        //            runSuccess(sMessageDescription);
        //        } else {
        //            runError(sMessageDescription);
        //        }
        //        reloadDatatable();
        //        clearAfterClosePopup("Delete");
        //    })
        //    .catch(error => {
        //        console.error('iIds:', trimmedIds);
        //        console.error('Error:', error);
        //    });
        //var httpMethod = 'Delete'
        var dataToSend = {
           
            iId: trimmedIds,
            iUser: userid, // Replace with your iUser and iMaster values
            iMaster: 0
        };
        $.ajax({
            url: `/Master/Delete`,
            contentType: 'application/json',
            // data: jsonString,
            //data: JSON.stringify(dataToSend),
            data: {
                sAPIName: sAPIName,
                queryParameters: dataToSend
            }
,
            dataType: 'json',
            success: function (response) {
                // Handle the success response here
                var data = response;
                console.log(response);
                const sResultData = data.ResultData;
                //alert("sResultData: " + sResultData);
                const sMessageDescription = data.MessageDescription;

                if (parseInt(sResultData) > 0) {
                    runsuccess1(sMessageDescription);
                } else {
                    runError(sMessageDescription);
                }
                reloadDatatable();
                clearAfterClosePopup("Delete");
            },
            error: function (xhr, status, error) {
                // Handle any errors here
                console.error(error);
            }
        });

    }
}

function clearAfterClosePopup(popupAction) {
    $("#modal-DeleteConfirm").hide();
    $("#btnSummaryDelete").prop("disabled", false);
}

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

    return [year, month, day].join('-');
}

//function handleAjaxSuccess(response, msg) {
//    //alert(msg)
//    if (response == "OK") {
//        runsuccess1(msg);
//        $("#GetMasterList").hide();

//    } else {
//        runError(response);
//    }
//    reloadDatatable();
//    $("#btnPost").prop("disabled", false);
//}

function handleAjaxSuccess(data) {
//    //// Handle the success response here
//    //console.log("Success:", JSON.stringify(data));
//    //data = JSON.stringify(data)
//    //data = JSON.parse(data);
//    //var sResultData = JSON.parse(data.ResultData);
//    //alert("sResultData: " + sResultData)
//    ////if (sResultData != null) {
//    //    // alert(JSON.stringify(sResultData.Table[0].iId));
//    //    //if (parseInt(sResultData.Table[0].iId) > 0) {
//    //        let sMessageDescription = JSON.stringify(data.MessageDescription);
//    //        sMessageDescription = sMessageDescription.slice(1, -1);

//    //if (sResultData != null) {
//    //    runSuccess(sMessageDescription);
//    //    $("#GetMasterList").hide();
//    //} else {
//    //    runError(sMessageDescription)
//    //}
//    //reloadDatatable();
//    //$("#btnPost").prop("disabled", false);



    try {
        // Log the success response
        console.log("Success:", data);
        
        var s = data;
        data = JSON.parse(data);
        // Assuming data.ResultData is already a JSON string, no need to parse it again
        var sResultData = data.ResultData;
        // Check if data.MessageDescription is an array and join its elements
        let sMessageDescription = Array.isArray(data.MessageDescription)
            ? data.MessageDescription.join(', ')
            : data.MessageDescription;
        sResultData = JSON.parse(sResultData)
        if (sResultData != null) {
            if (parseInt(sResultData.Table[0].iId) > 0) {
                runsuccess1(sMessageDescription);
                $("#GetMasterList").hide();
            }
            else {//-2 : Name already exists , -3 : Code already exists
                runError(sMessageDescription);
            }
        } else { //Required fields
            runError(sMessageDescription);
        }

        reloadDatatable();
        $("#btnPost").prop("disabled", false);
    } catch (error) {
        // Handle any potential errors that might occur during processing
        console.error("Error:", error);
    }
}







function handleAjaxError(error) {
    // Handle any errors that occur during the AJAX request
    console.error("Error in AJAX request:", error);
    $("#btnPost").prop("disabled", false);
}

function enableBatch() {
    var flagBatch = "";
    var _chkBatch = document.getElementById("chkBatch");
    flagBatch = _chkBatch.checked ? 1 : 0;
    return flagBatch;
}

function enableGroup() {
    var _chkGroup = document.getElementById("chkGroup");
    return _chkGroup.checked ? 1 : 0;
}

function setDefaultValueIfEmpty(inputSelector, ...outputSelectors) {
    const inputValue = $(inputSelector).val();
    if (inputValue === "") {
        for (const outputSelector of outputSelectors) {
            $(outputSelector).val(0);
        }
    }
}








