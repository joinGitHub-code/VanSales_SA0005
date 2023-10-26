var userid = $("#hdn_SessionUID").val();
var bAsParent = 0;
var iDecimalAmount = 0;
const elementMapping = { //post,getdetail,clearfields
    "hdn_iId": "iId",
    "tName": "sName",
    "tCode": "sCode",
    "tAltname": "sAltName",
    "Type": "sType",
    "Type-id": "iType",
    "tVat": "fVatPer",
    "tTax": "fTaxper",
    "Parent": "sParent",
    "Parent-id": "iParentId",
     
};

$(document).ready(function () {
       $.ajax({
            url: "/Master/GetDetails",
            data: {
                sAPIName: "GetDecimalSettings",
                iId: "-1",
            },
            method: 'get',
           success: function (data) {
               try {
                   // Assuming data is a string containing JSON data
                   //const parsedData = JSON.parse(data);
                  // alert("parsedData " + JSON.stringify(data[0].iDecimalAmount))
                   // Assuming ResultData is a property of the parsed JSON object
                  // const resultData = JSON.parse(parsedData.ResultData);
                   // Assuming iDecimalAmount is a property of the first element of ResultData
                   iDecimalAmount = parseInt(data[0].iDecimalAmount);
                   // Now you can use iDecimalAmount as needed
                   console.log("iDecimalAmount: " + iDecimalAmount);
               } catch (error) {
                   console.error('Error parsing JSON data:', error);
               }
           },
           error: function (error) {
               console.error("Error in processing /GetDecimalSettings: ", error);
           },
    });
});


function handleNewButtonClick(bGroup) {
    bAsParent = bGroup;
    newMode();
   
}
//$("#btnNew").click(handleNewButtonClick);
$("#btnNew").click(() => {
    handleNewButtonClick(0);
});
$("#btnNewPopup").click(() => {
    handleNewButtonClick(0);
});
$("#btnAddGroup").click(() => {
    handleNewButtonClick(1);
});



$("#btnPost").click(function () {
    setDefaultValueIfEmpty('#Type', '#Type-id', '#Type-code');
    setDefaultValueIfEmpty('#Parent', '#Parent-id', '#Parent-code');

    mainTableList = [];
    $('#productSummaryTable input[type="checkbox"]').prop('checked', false);


    let postFlag = true;
    //const fieldsToValidate = [
    //    { fieldId: "tName", errorMessage: "Name is required" },
    //    { fieldId: "tCode", errorMessage: "Code is required" },
    //    { fieldId: "tAltname", errorMessage: "Altname is required" },
    //    { fieldId: "Type", errorMessage: "Type is required" },
    //    { fieldId: "tVat", errorMessage: "Vat is required" },
    //    { fieldId: "tTax", errorMessage: "Tax is required" },
       
        
    //];
   
    //for (const fieldInfo of fieldsToValidate) {
    //    const fieldValue = $("#" + fieldInfo.fieldId).val();
    //    if (fieldValue.trim() === "") {
    //        postFlag = false;
    //        runError(fieldInfo.errorMessage);
    //        break; // Stop validation on the first error
    //    }
    //}
       
    if (postFlag) {
        $("#btnPost").prop("disabled", true);
        iId = $("#hdn_iId").val();

        // Create the AccountDetails object using elementMapping
        //const fieldToExclude = 'fieldIdToExclude';
        //if (fieldId !== fieldToExclude) { // Check if the current fieldId is not the one you want to exclude
        var ProductDetails = {};
        const excludedFieldIds = ['Type', 'fCostPrice','fSellingPrice']; 
        for (const fieldId in elementMapping) {            
            if (!excludedFieldIds.includes(fieldId)) { // Check if the current fieldId is not in the excluded list
                const fieldName = elementMapping[fieldId];               
                ProductDetails[fieldName] = $("#" + fieldId).val().trim();
            }
        }
        ProductDetails["fCostPrice"] = 0;
        ProductDetails["fSellingPrice"] = 0;
        ProductDetails["bBatch"] = enableBatch();
        ProductDetails["bGroup"] = bAsParent;
        ProductDetails["iUser"] = $("#hdn_SessionUID").val();

        var sProductDetails = JSON.stringify(ProductDetails);
        console.log("ProductDetails Post", sProductDetails);
        postMasterDetails(sProductDetails, 'PostProduct')
       
    }

});


// Use event delegation for double clicks on table rows
$(document).on('dblclick', '#productSummaryTable tbody tr', function () {
    var row = $(this);
    var data = $('#productSummaryTable').DataTable().row(row).data();
    handleDoubleClickOrButtonClick("GetProductDetails",data );
});

// Use a single event handler for the button click
$("#btnSummaryEdit").click(function () {
    if (mainTableList.length > 0) {
        var data = mainTableList;
        handleDoubleClickOrButtonClick("GetProductDetails",data[0] );
    } else {
        runError("Please Select Any Checkbox");
    }
});

function GetDetails(data) {
    //alert("GetDetails" + JSON.stringify(data));
   // data = JSON.parse(data)
   // const record = JSON.parse(data.ResultData);
    //if (JSON.stringify(record) != "[]") {
        $("#GetMasterList").show();
        $.each(elementMapping, (elementId, dataProperty) => {
            $(`#${elementId}`).val(data[0][dataProperty]);
        });
        $("#Type-code").val(data[0].sTypeCode);
        //if (record[0].bGroup == "false") {
        //    bAsParent = 0;
        //}
        //else {
        //    bAsParent = 1;
        //}
        bAsParent = data[0].bGroup
        // alert("bBatch ;" + record[0].bBatch);        
        // Define an object that maps record properties to checkbox IDs
        const propertyToCheckboxMap = {
            bBatch: '#chkBatch',
            //bGroup: '#chkGroup',
        };
        // Loop through the properties and update the corresponding checkboxes
        for (const property in propertyToCheckboxMap) {
            const checkboxID = propertyToCheckboxMap[property];
            const isChecked = data[0][property] === true;
            $(checkboxID).prop('checked', isChecked);
        }
   // }
    //else {
    //    console.log("No Data Available from API");
    //}
}

function onBlurTaxType(evt) {
    var fTaxType = "0";
    var invCol_id = evt.srcElement.id;
    if (invCol_id === "tTax" || invCol_id === "tVat") {
        fTaxType = parseFloat($("#" + invCol_id).val()).toFixed(iDecimalAmount);
        $("#" + invCol_id).val(fTaxType);
    }
    console.log("evt: " + evt);
    console.log("invCol_id: " + invCol_id);
}

$("#btnSummaryDelete").click(function () {
    deleteConfirm();
});

$("#btnyes").click(function () {       
    deleteMasters("DeleteProduct", userid);  
    $('#productSummaryTable input[type="checkbox"]').prop('checked', false);
    mainTableList = [];  
    
});

$("#btnno").click(function () {
    clearAfterClosePopup("Delete");
})
$("#btnclosede").click(function () {
    clearAfterClosePopup("Delete");

})








// Centralized function for fetching master details
//function getMasterDetails (sAPIName, iId) {
//    $("#hdn_iId").val(iId);   
//    $.ajax({
//        url: "/Master/GetDetailsEdit",
//        data: {
//            sAPIName: sAPIName,
//            iId: iId,
//        },
//        method: 'get',
//        success: function (data) {
//            console.log("Edit: ", data);
//            clearFields();
//            $("#GetMasterList").show();
//            GetDetails(data);
//        },
//        error: function (error) {
//            console.error("Error in getMasterDetails (): ", error);
//        },
//    });
//}



// SUMMARY//

// Define DataTable columns
const columns = [
    {
        'width': 10,
        'targets': 0,
        'searchable': false,
        'orderable': false,
        'autoWidth': false,
        'render': function (data, type, full, meta) {
            return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(data).html() + '">';
        }
    },
   
    {
        "data": "sName",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    },
    {
        "data": "sCode",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    },
    {
        "data": "fVatPer",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    },
    {
        "data": "fTaxper",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    }
    ,
    {
        "data": "bBatch",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    }
];




var tableInstance = createDataTable("Master/MasterSummaryDataTable", "productSummaryTable", columns, "GetProductSummary");
var mainTableList = [];
// Clear mainTableList on DataTable draw
$('#productSummaryTable').on('draw.dt', function () {
    mainTableList = [];
});

// Handle checkbox change events
$("#productSummaryTable").on('change', 'input[type=checkbox]', function (event) {
    var $row = $(this).closest('tr');
    var data = tableInstance.rows($row).data();
    var rowId = data[0];
    if (this.checked) {
        mainTableList.push(rowId);

    } else {
        var index = mainTableList.indexOf(rowId);
        if (index !== -1) {
            mainTableList.splice(index, 1);
        }
    }
});

// Function to reload the DataTable
function reloadDatatable() {
    tableInstance.ajax.reload();
}

function clearFields() {
    mainTableList = [];
    $("#btnPost").prop("disabled", false);
    $('#productSummaryTable input[type="checkbox"]').prop('checked', false);

    // Loop through the elementMapping object and reset each element
    const excludedFieldIds = ['hdn_iId', 'Type-id'];
    for (const elementId in elementMapping) {
        //const dataProperty = elementMapping[elementId];
        if (!excludedFieldIds.includes(elementId))
            $(`#${elementId}`).val("");
    }
    $('input[type = "checkbox"]' + '#chkBatch').prop('checked', false);
    $('input[type = "checkbox"]' + '#chkGroup').prop('checked', false);
    $("#hdn_iId").val(0);
    $("#Type-id").val(0);
    $("#Type-code").val(0);

}

function createDataTable(url, dataTableID, columns, sAPIName) {
    //alert("url: " + url)
    //alert("dataTableID: " + dataTableID)
    //alert("columns: " + JSON.stringify(columns))
    //alert("aoDataValue: " + JSON.stringify(aoDataValue));
    // Configure DataTable
    var table = $('#' + dataTableID).DataTable({
        "sAjaxSource": "/Master/MasterSummaryDataTable",
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "userId", "value": userid }, { "name": "sAPIName", "value": sAPIName });
            //aoData.push(aoDataValue);
        },
        "initComplete": function (settings, json) {
            $("#" + dataTableID).wrap("<div style='overflow:auto; width:100%;max-height:350px; position:relative;'></div>");
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
        },
        "columns": columns,
    });
    return table;
}











