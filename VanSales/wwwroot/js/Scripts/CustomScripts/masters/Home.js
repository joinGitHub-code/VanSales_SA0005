
//warehouse,location and company
var userid = $('#hdn_SessionUID').val();
var table;
var rowId = "";
var mainTableList = [];
const menuId = $('#hdn_MenuId').val();
const tableId = menuId === '6' ? 'wareHouseSummaryTable' : 'masterSummaryTable';
var modalId = menuId === '6' ? 'WarHousePopup' : 'MasterPopup';
var parentId = 0;
const url = '/Master/MasterSummaryDataTable';
var isGroup = 0;
var singleClickTimer;
var doubleClickDelay = 200;
var isDoubleClick = false; // Flag to track double-click
var initializeTable;
const apiMethod = menuId === '6' ? 'GetWareHouseSummary' : 'GetMasterSummary';
$(document).ready(function () {

    initializeTable = () => {
        return initializeDataTable(tableId, url, apiMethod, menuId, parentId);
    };
    table = initializeTable();
    table.on('draw.dt', function () {
        mainTableList = [];
    });
    $(document).on('change', '#' + tableId + ' input[type=checkbox]', function (event) {
        var $row = $(this).closest('tr');
        var data = table.row($row).data();

        if (data) {
            rowId = data.iId;
            // console.log(rowId);
            var index = $.inArray(rowId, mainTableList);

            if (this.checked && index === -1) {
                mainTableList.push(rowId);
            }
            else if (!this.checked && index !== -1) {
                mainTableList.splice(index, 1);
            }
            // console.log(rowId);

            if (mainTableList.length > 0) {
                $("#hdn_iId").val(rowId)
            }
            else {
                $("#hdn_iId").val(0)
            }
        }
    });



    $(document).on('dblclick', '#' + tableId + ' tbody tr', function () {
        isDoubleClick = true; // Set the flag for double-click
        clearTimeout(singleClickTimer);
        var row = $(this).closest('tr');
        var data = $('#' + tableId).dataTable().fnGetData(row);
        mainTableList.push(data);
        $("#hdn_iId").val(data.iId);
        getDetails();
        mainTableList = [];
    });



});

$('#btnPostPopup').click(function () {
    if (userid === 0) {
        window.location = "/Security/Login";
    } else {
        const details = {
            iId: $('#hdn_iId').val(),
            sName: $('#sName').val(),
            sCode: $('#sCode').val(),
            sAltName: $('#sAltname').val(),
            iUser: userid,
            bGroup: $('#bGroup').val(),
            iParentId: $('#sParent-id').val(),
            iMaster: menuId
        };
        if (menuId === '6') {
            details.iSalesman = $('#sSalesman-id').val();
            details.iLocation = $('#sLocation-id').val();
            details.sVehicleNo = $('#sVnumber').val();
            details.iCompany = $('#sCompany-id').val();
            details.sDueDate = $('#sDuedate').val();
            //details.bGroup = $('#bGroup').val();
            //details.iParentId = $('#sParent-id').val();
        }
        saveData(details, menuId === '6' ? "PostWareHouse" : "PostMaster", modalId);
    }
});

function saveData(Details, sApiName) {

    //if ($('#sCode').val() !== "" && !/^[a-zA-Z0-9]+$/.test($('#sCode').val())) {
    //    runError("Please enter a valid Code");
    //}

    if ($('#sVnumber').val() !== "" && !/^[a-zA-Z0-9]+$/.test($('#sVnumber').val())) {
        runError("Please enter a valid Vehicle Number");
    }
    else {
        var serializedDetails = JSON.stringify(Details);
        // console.log(serializedDetails.iId);
        var msg = (Details.iId === '0') ? "Inserted Successfully" : "Updated Successfully";

        $.ajax({
            url: '/Master/Post',
            type: "Post",
            data: { 'obj': serializedDetails, sAPIName: sApiName },
            success: function (response) {
                // console.log(response);
                var responseData = JSON.parse(response);
                var status = responseData.Status;
                var resultData = JSON.parse(responseData.ResultData);
                var iid = resultData.Table[0].iId;
                console.log(iid);
                if (isGroup === 0) {
                    if (status == "Success") {
                        runsuccess1(msg);
                        table.ajax.reload();

                        Clear();
                        //closeModal(modalId);
                    } else {
                        runError(responseData.MessageDescription);
                    }
                } else {
                    // console.log(isGroup);
                    var ids;
                    if (mainTableList.length > 0) {
                        ids = mainTableList.join(',');
                    } else {
                        ids = 0;
                    }
                    //  console.log(ids);
                    updateNodePosition(ids, iid)
                    runsuccess1(msg);
                    table.ajax.reload();

                    Clear();
                }

                mainTableList = [];
                loadTree();
                $("#btnPostPopup").prop("disabled", false);
                table.ajax.reload();
            }

        });
    }

}


$('#btnNew,#btnNewGroup,#btnGroup').click(function () {
    Clear();
    if (this.id === 'btnNewGroup') {
        $('#bGroup').val('true');
    }
    if (this.id === 'btnGroup') {
        if (mainTableList.length > 0) {
            $('#bGroup').val('true');
            isGroup = 1;
        } else {
            runError("Please Select a Checkbox");
            return;
        }
    }

    openModal(modalId);
});

$('#btnClosePopup').click(function () {
    closeModal(modalId);
});
$('#btnNewPopup').click(function () {
    Clear();
});
function Clear() {
    $('#hdn_iId').val(0);
    $('#sName, #sCode, #sAltname,#sParent').val("");
    $('#sParent-id').val(0);
    $('#bGroup').val('false');

    if (menuId === '6') {
        $('#sCompany-id,#sSalesman-id,#sLocation-id').val(0);
        $('#sSalesman,#sLocation,#sVnumber,#sDuedate,#sCompany').val("");
    }

}





$("#btnSummaryEdit").click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {
        // console.log(mainTableList.length);
        if (mainTableList.length > 0) {
            var data = mainTableList;
            getDetails();
        }
        else {
            runError("Please Select Any Checkbox");
        }
    }
});
function getDetails() {
    const iid = $('#hdn_iId').val();
    const apiMethod = menuId === '6' ? 'GetWareHouseDetails' : 'GetMasterDetails';
    const imenu = menuId === '6' ? 0 : menuId;
    callAjaxRequest(iid, apiMethod, imenu);
}

function callAjaxRequest(iid, sApiName, imenu) {
    $.ajax({
        url: '/Master/GetDetails',
        type: "GET",
        data: { sAPIName: sApiName, iId: iid, iMaster: imenu },
        success: function (data) {
            // console.log(data);
            //if (data !== null && data !== undefined) {
            if (data.response) {
                runError(data.response);
            } else {
                getMasterData(data);
            }
            mainTableList = [];
            table.ajax.reload();
        }

    });
}

function getMasterData(data) {
    $('#hdn_iId').val(data[0].iId);
    $('#sName').val(data[0].sName);
    $('#sCode').val(data[0].sCode);
    $('#sAltname').val(data[0].sAltName);
    $('#sParent-id').val(data[0].iParentId),
        $('#sParent').val(data[0].sParent),
        $('#bGroup').val(data[0].bGroup);
    if (menuId == '6') {
        $('#sSalesman-id').val(data[0].iSalesman),
            $('#sSalesman').val(data[0].sSalesMan),
            $('#sLocation-id').val(data[0].iLocation),
            $('#sLocation').val(data[0].sLocation),
            $('#sVnumber').val(data[0].iVehicleNo),
            $('#sCompany-id').val(data[0].iCompany),
            $('#sCompany').val(data[0].sCompany),
            $('#sDuedate').val(data[0].sDueDate)

    }
    openModal(modalId);
}



$("#btnDelete").click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {
        if (mainTableList.length > 0) {
            $("label[for='msg']").text("Do you want to Delete '" + mainTableList.length + "' Row?");
            openModal("modal-DeleteConfirm");
        }
        else {
            runError("Please Select Any Checkbox");
        }
    }
});

$("#btnyes").click(function () {
    closeModal('modal-DeleteConfirm');
    var ids = mainTableList.join(',');
    $.ajax({
        url: '/Master/Delete',
        method: 'get',
        data: {
            sAPIName: (menuId === '6') ? "DeleteWareHouse" : "DeleteMaster",
            iId: ids,
            iUser: userid,
            iMaster: (menuId === '6') ? 0 : menuId
        },
        success: function (data) {
            data = JSON.parse(data);
            const sResultData = data.ResultData;
            const sMessageDescription = data.MessageDescription;

            if (sResultData > "0") {
                runsuccess1(sMessageDescription);
                $('#' + tableId + ' input[type="checkbox"]').prop('checked', false);

                mainTableList = [];
            }
            else if (sResultData === "0") {

                runError(sMessageDescription);
            } else {
                runError(sMessageDescription);
            }
            loadTree();
            table.ajax.reload();
        }
    });


});

$("#btnno").click(function () {
    closeModal('modal-DeleteConfirm');
    $('#' + tableId + ' input[type="checkbox"]').prop('checked', false);
    mainTableList = [];
});
function copyValue() {
    var hdn_iIdValue = document.getElementById('hdn_iId').value;
    return hdn_iIdValue;
}
function getMenuValue() {
    return menuId;
}
$('#btnExport').click(function () {
    window.location = "/Master/ExportExcelForMaster?sAPIName=GetWareHouseSummary";
});

//$('#btnExport').click(function () {
//    window.location = "/Master/ExportExcelForMaster?sAPIName=GetWareHouseSummary"
//});
// to set prperty
