
var userid = $("#hdn_SessionUID").val();

var bAsParent = 0;
const elementMapping = { //post,getdetail,clearfields
    "hdn_iId": "iId",
    "txtname": "sName",
    "txtcode": "sCode",
    "Customer": "sCustomer",
    "Customer-id": "iCustomer",
    "Location": "sLocation",
    "Location-id": "iLocation",
    "txttrn": "sTRN_No",
    "txtaddr1": "sAddress1",
    "txtaddr2": "sAddress2",
    "txtLatlan": "sGeoLocation",
    "txtpin": "sPincode",
    "txtmob": "sMobile",
    "txtphn": "sPhone",
    "txtcontact": "sContactPersonNo",
    "hdn_SessionUID":"iUser",   
    "Parent": "sParent",
    "Parent-id": "iParentId",
    
};





function handleNewButtonClick(bGroup) {         
    bAsParent = bGroup;    
    newMode();    
    //alert("bAsParent " + bAsParent)
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

function setDefaultValueIfEmpty(inputSelector, ...outputSelectors) {
    const inputValue = $(inputSelector).val();
    if (inputValue === "") {
        for (const outputSelector of outputSelectors) {
            $(outputSelector).val(0);
        }
    }
}



/**
 * Posting Data.
 *
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */

$("#btnPost").click(function () {

    setDefaultValueIfEmpty('#Customer', '#Customer-id', '#Customer-code');
    setDefaultValueIfEmpty('#Location', '#Location-id', '#Location-code');
    setDefaultValueIfEmpty('#Parent', '#Parent-id', '#Parent-code');

    mainTableList = [];
    $('#outletSummaryTable input[type="checkbox"]').prop('checked', false);
    //const fieldsToValidate = [
    //    { fieldId: "txtname", errorMessage: "Name is required" },
    //    { fieldId: "txtcode", errorMessage: "Code is required" },
    //    { fieldId: "Customer", errorMessage: "Customer is required" },
    //    { fieldId: "Location", errorMessage: "Location is required" },
    //    { fieldId: "txttrn", errorMessage: "Trn no is required" },
    //    { fieldId: "txtaddr1", errorMessage: "Address 1 is required" },
    //    { fieldId: "txtaddr2", errorMessage: "Address 2 is required" },
    //    { fieldId: "txtlatlon", errorMessage: "Latitude and Longitude is required" },
    //    { fieldId: "txtpin", errorMessage: "Pin is required" },
    //    { fieldId: "txtmob", errorMessage: "Mobile is required" },
    //    { fieldId: "txtphn", errorMessage: "Phone no is required" },
    //    { fieldId: "txtcontact", errorMessage: "Contact person no is required" },
    //];
    //let postFlag = true;
    //for (const fieldInfo of fieldsToValidate) {
    //    const fieldValue = $("#" + fieldInfo.fieldId).val();
    //    if (fieldValue.trim() === "") {
    //        postFlag = false;
    //        runError(fieldInfo.errorMessage);
    //        break; // Stop validation on the first error
    //    }
    //}
    //let postFlag = true;
    //for (const fieldId in elementMapping) {
    //    const fieldValue = $("#" + fieldId).val();
    //    const fieldName = elementMapping[fieldId];

    //    if (fieldValue.trim() === "") {
    //        postFlag = false;
    //        runError(`${fieldName} is required`);
    //        break; // Stop validation on the first error
    //    }
    //}
    // alert("postFlag: " + postFlag)
    //if (postFlag) {
        $("#btnPost").prop("disabled", true);
        iId = $("#hdn_iId").val();
        var OutletDetails = {};
        const excludedFieldIds = ['Location', "Customer", "hdn_SessionUID","Parent"];
        for (const fieldId in elementMapping) {
            if (!excludedFieldIds.includes(fieldId)) { // Check if the current fieldId is not in the excluded list
                const fieldName = elementMapping[fieldId];
                OutletDetails[fieldName] = $("#" + fieldId).val().trim();
            }
        }
        OutletDetails["iUser"] = userid;
        OutletDetails["bGroup"] = bAsParent;        
        var sOutletDetails = JSON.stringify(OutletDetails);
        console.log("OutletDetails Post", sOutletDetails);
        postMasterDetails(sOutletDetails, 'PostOutlet')
    //}

});

/** 
 * Get Details - Edit.  
 */

// Double click event handler
$(document).on('dblclick', '#outletSummaryTable tbody tr', function () {
    const row = $(this);
    const data = $('#outletSummaryTable').DataTable().row(row).data();    
    handleDoubleClickOrButtonClick("GetOutletDetails", data);
});

// Button click event handler
$("#btnSummaryEdit").click(function () {   
        if (mainTableList.length > 0) {
            const data = mainTableList;           
            handleDoubleClickOrButtonClick("GetOutletDetails", data[0]);
        } else {
            runError("Please Select Any Checkbox");
        }
    
});

function GetDetails(data) {
   
  //  data = JSON.parse(data)    
   // const record = JSON.parse(data.ResultData);    
  //  if (data != "[]") {       

        // Loop through the elementMapping object and set values
        //for (const elementId in elementMapping) {
        //    const dataProperty = elementMapping[elementId];
        //    $(`#${elementId}`).val(record[0][dataProperty]);
        //}
    $.each(elementMapping, (elementId, dataProperty) => {
        $(`#${elementId}`).val(data[0][dataProperty]); 
        console.log(data[0][dataProperty]);
    });
   
        bAsParent = data[0].bGroup;
        $("#GetMasterList").show();
         
        //if (record[0].bGroup == "false") {
        //    bAsParent = 0;
        //}
        //else {
        //    bAsParent = 1;
        //}
        //alert("edit: " + bAsParent);
    //}
    //else {
    //    console.log("No Data Available from API");
    //}
}




$("#btnSummaryDelete").click(function () {   
        deleteConfirm();    
});

$("#btnyes").click(function () {    
   
        deleteMasters("DeleteOutlet", userid);   
        $('#outletSummaryTable input[type="checkbox"]').prop('checked', false);
        mainTableList = [];
});

$("#btnno").click(function () {
    clearAfterClosePopup('Delete')
});
$("#btnclosede").click(function () {
    clearAfterClosePopup('Delete')
});


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
        "data": "sCustomer",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    },
    {
        "data": "sLocation",
        "autoWidth": true,
        'orderable': false,
        "searchable": true
    }
];




var tableInstance = createDataTableMaster("MasterSummaryDataTable", "outletSummaryTable", columns, "GetOutletSummary");


var mainTableList = [];
// Clear mainTableList on DataTable draw
$('#outletSummaryTable').on('draw.dt', function () {
    mainTableList = [];
});




// Handle checkbox change events
$("#outletSummaryTable").on('change', 'input[type=checkbox]', function (event) {    
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

function createDataTableMaster(url, dataTableID, columns, sAPIName) {

    // Configure DataTable
    var table = $('#' + dataTableID).DataTable({
        "sAjaxSource": "/Master/" + url,
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "userId", "value": userid }, { "name": "sAPIName", "value": sAPIName });
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

// Function to reload the DataTable
function reloadDatatable() {
    tableInstance.ajax.reload();
}

function clearFields() {

    mainTableList = [];
    $("#hdn_iId").val(0);
    $("#btnPost").prop("disabled", false);
    $('#outletSummaryTable input[type="checkbox"]').prop('checked', false);
    // Define an array of element IDs to reset
    //const elementsToReset = [
    //    "txtname", "txtcode", "Customer", "txtloc", "txttrn",  "txtaddr1",
    //    "txtaddr2",  "txtlatlon", "txtpin", "txtmob", "txtphn",    "txtcontact",
    //];
    // Loop through the array and reset each element
    //elementsToReset.forEach(function (elementId) {
    //    $("#" + elementId).val("");
    //});
    // Loop through the elementMapping object and reset each element

    const excludedFieldIds = ['hdn_iId'];
    for (const elementId in elementMapping) {
        //const dataProperty = elementMapping[elementId];
        if (!excludedFieldIds.includes(elementId))
            $(`#${elementId}`).val("");
    }
    $('input[type = "checkbox"]' + '#chkGroup').prop('checked', false);    
    const elementIdsToReset = [
        "Customer",       
        "Location",      
        "Parent",
        
    ];
    // Loop through the element IDs and set their values to 0
    elementIdsToReset.forEach(id => {
        $("#" + id + "-id").val(0);
        $("#" + id + "-code").val(0);
        
    });
}

$("#btnClosePopup").click(function () {
    $("#GetMasterList").hide();
    mainTableList = [];
    $('#outletSummaryTable input[type="checkbox"]').prop('checked', false);
});

$(document).ready(function () {
    
    // Initialize variables
    var initialLat = 11.8745;
    var initialLan = 75.3704;
    var map;
    var geocoder;
    var marker;
    // Function to show the map
    function showMap() {
        $('#map').show();
    }
    // Function to hide the map
    function hideMap() {
        $('#map').hide();
    }

    // Initialize the Google Map
    function initMap() {
        //var mapElement = document.getElementById('map');
        //if (!mapElement) {
        //    console.error('#map element not found in the DOM.');
        //    return;
        //}
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: initialLat, lng: initialLan },
            zoom: 10
        });

        // Initialize the Geocoder
        geocoder = new google.maps.Geocoder();

        // Create a marker
        marker = new google.maps.Marker({
            map: map,
            draggable: true // Allow marker to be moved
        });

        // Handle marker drag event
        google.maps.event.addListener(marker, 'dragend', function () {
            updateInputField(marker.getPosition().lat(), marker.getPosition().lng());
        });

        // Handle location search when user types in the text box
        $('#txtLatlan').on('input', function () {
            var address = $(this).val();
            if (address) {
                geocodeAddress(address);
            }
        });

        // Handle map click to select a location
        google.maps.event.addListener(map, 'click', function (event) {
            marker.setPosition(event.latLng);
            updateInputField(event.latLng.lat(), event.latLng.lng());
        });


        // Function to update the input field with new coordinates
        function updateInputField(newLat, newLan) {
            var roundedLat = parseFloat(newLat).toFixed(5);
            var roundedLan = parseFloat(newLan).toFixed(5);
            $('#txtLatlan').val(roundedLat + ', ' + roundedLan);
        }

        // Function to geocode an address and set the marker on the map
        function geocodeAddress(address) {
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === 'OK' && results[0]) {
                    var location = results[0].geometry.location;
                    map.setCenter(location);
                    marker.setPosition(location);
                    updateInputField(location.lat(), location.lng());
                } else {
                    console.error('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
    }
    // Initialize the map when the document is ready
    $(document).ready(function () {
        initMap();
        hideMap();
    });

    // Handle location change button click
    $(document).on('click', '#txtLatlan', function (e) {
        e.stopPropagation(); // Prevent the click event from propagating to the document
        showMap();
    });

    // Handle map close button click
    $('#map').on('click', function (e) {
        e.stopPropagation(); // Prevent the click event from propagating to the document
    });

    // Handle clicks outside of the map and text box to hide the map
    $(document).on('click', function () {
        hideMap();
    });
});











