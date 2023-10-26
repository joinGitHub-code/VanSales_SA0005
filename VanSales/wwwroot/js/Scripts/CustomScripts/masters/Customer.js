var userid = $('#hdn_SessionUID').val();
//alert("userid: " + userid);
var type = 0;
var mainTableList = [];
var rowId = "";
var table;

$('#btnPrint').click(function () {
    var iid = $('#hdn_iId').val();
    $.ajax({
        url: '/Master/GetDetails',
        type: "GET",
        data: { sAPIName: "GetCustomerDetails", iId: iid, iMaster: type },
        success: function (data) {
            console.log("GetDetails response:", data);

            if (data && !data.response) {
                console.log("No error, proceeding to CreatePdf request.");

                // Proceed to CreatePdf
                $.ajax({
                    url: '/PdfCreator/CreatePdf?iId='+ data[0].iId,
                    type: "POST",
                    contentType: 'application/json',
                    data: JSON.stringify({ iId: data[0].iId, data: data }), // Send the data as JSON
                    success: function (response) {
                        console.log("CreatePdf response:", response);
                       // alert(response);
                        $('#txtname').val(data[0].sName);
                        $('#txtcode').val(data[0].sCode);
                        $('#txtaltname').val(data[0].sAltName);
                        openModal('GetMasterList');//just tested after th pdf creation modal opened instead of print screen 
                       
                    }
                });
            } else if (data && data.response) {
                console.log("Error response:", data.response);
                runError(data.response);
            } else {
                console.log("Invalid data in response");
            }
            table.ajax.reload();
        }
    });
});


function getMenuValue() {
    return $('#hdn_MenuId').val();
}
$('#btnPost').click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {
        const crediamountValue = ($('#txtCrediamount').val() === "") ? "0.00" : $('#txtCrediamount').val();   
            var customerDetails = {
                "iId": $('#hdn_iId').val(),
                "sName": $('#txtname').val(),
                "sCode": $('#txtcode').val(),
                "sAltName": $('#txtaltname').val(),
                "sTRN_No": $('#sTrnnumber').val(),
                "iType": $('#sType-id').val(),
                "sType": $('#sType').val(),
                "iCreditDays": $('#txtCreditdays').val(),
                "fCreditAmount": crediamountValue,
                "sAddress": $('#txtAddress').val(),
                "sGeoLocation": $('#txtLatlan').val(),
                "sCity": $('#txtCity').val(),
                "sCountry": $('#txtCountry').val(),
                "sPincode": $('#txtPinnumber').val(),
                "sMobile": $('#txtMobile').val(),
                "sPhone": $('#txtPhone').val(),
                "iUser": userid,
                "sEmail": $('#sEmail').val(),
                "sFax": $('#sFax').val(),
                "sContactPersonNo": $('#sContactperson').val(),
                "sWebsite": $('#sWebsite').val(),
                "bGroup": $('#bGroup').val(),
                "iParentId":$('#sParent-id').val()
        }
       
        if (!/^[a-zA-Z0-9]+$/.test($('#txtcode').val())) {
            runError("Please enter a Valid Code");
        }
        else if ($('#txtCountry').val().trim() !== "" && !/^[a-zA-Z\s]+$/.test($('#txtCountry').val())) {
            runError("Please enter a Valid Country Name");
        }
        else if ($('#txtCity').val().trim() !== "" && !/^[a-zA-Z\s'-]+$/.test($('#txtCity').val().trim())) {
            runError("Please enter a Valid City Name");
        }
        else if ($('#txtMobile').val().trim() !== "" && !/^[+]?\d{10,}$/.test($('#txtMobile').val().trim())) {
            runError(" Mobile Number  must have at least 10 digits");
        }
        else if ($('#txtPhone').val().trim() !== "" && !/^[+]?\d{10,}$/.test($('#txtPhone').val().trim())) {
            runError("Phone numbers must have at least 10 digits");
        }
        else if ($('#sContactperson').val().trim() !== "" && !/^[+]?\d{10,}$/.test($('#sContactperson').val().trim())) {
            runError("ContactPerson Number must have at least 10 digit");
        }
        else {
            var msg = (customerDetails.iId === '0') ? "Inserted Successfully" : "Updated Successfully";
            var sCustomerDetails = JSON.stringify(customerDetails);
            //console.log("iId value:", customerDetails.iId);
            //console.log("Message:", msg);
            console.log(sCustomerDetails);
            $.ajax({
                url: '/Master/Post',
                type: "Post",
                data: { 'obj': sCustomerDetails, sAPIName: "PostCustomer" },
                success: function (response) {
                    if (response == "OK") {
                        runsuccess1(msg);
                        clearFields();
                        table.ajax.reload();
                        // $("#GetMasterList").hide();
                    }
                    else {
                        runError(response);
                    }
                    $("#btnPost").prop("disabled", false);

                }
            });
        }
       
    }
});


$("#btnNew,#btnNewGroup").click(function () {
    clearFields();
    if (this.id == 'btnNewGroup') {
        $('#bGroup').val(1);
    }
    openModal('GetMasterList');

})
$("#btnClosePopup, #btnNewPopup").on("click", function () {
    if (this.id === "btnClosePopup") {
      closeModal("GetMasterList");
    } else {
      clearFields();
    }
  });

function clearFields() {
    $('#hdn_iId,#sParent-id,#bGroup').val(0);
    $('#txtname, #txtcode,#txtaltname,#sTrnnumber,#sType,#txtCreditdays,#txtCrediamount,#txtAddress,#txtLatlan,#txtCity,#txtCountry,#sType-id').val("");  
    $('#txtCity,#txtCountry,#txtPinnumber,#txtMobile,#txtPhone,#sFax,#sWebsite,#sEmail,#sContactperson,#sParent').val("");
}

$('#customerSummaryTable').on('draw.dt', function () {
    mainTableList = [];
})
$("#customerSummaryTable").on('change', 'input[type=checkbox]', function (event) {
    var $row = $(this).closest('tr');
    var data = table.row($row).data();

    if (data) {
        rowId = data.iId; 
        console.log(rowId);
        var index = $.inArray(rowId, mainTableList);
        if (this.checked && index === -1) {
            mainTableList.push(rowId);
        }
        else if (!this.checked && index !== -1) {
            mainTableList.splice(index, 1);
        }
        console.log(rowId);
        if (mainTableList.length > 0) {
            $("#hdn_iId").val(rowId)
        }
        else {
            $("#hdn_iId").val(0)
        }
    }
});

$("#btnSummaryEdit").click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {
        console.log(mainTableList);
        if (mainTableList.length > 0) {
            var data = mainTableList;
            getCustomerDetails();
        }
        else {
            runError("Please Select Any Checkbox");
        }
    }
});

function getCustomerDetails() {
    var iid = $('#hdn_iId').val();
    $.ajax({
        url: '/Master/GetDetails',
        type: "GET",
        data: { sAPIName: "GetCustomerDetails", iId: iid, iMaster: type },
        success: function (data) {
            //  if (data !== null && data !== undefined) {
            if (data.response) {
                runError(data.response);
            } else {
                getDetails(data);
            }
           // mainTableList = [];
            table.ajax.reload();
        }
            //} else {
            //    runError("Empty or invalid response received.");
            //}
      //  },
        //error: function () {
        //    runError("An error occurred while fetching customer details.");
        //}
    });
}

function getDetails(data) {
    $('#hdn_iId').val(data[0].iId);
    $('#txtname').val(data[0].sName);
    $('#txtcode').val(data[0].sCode);
    $('#txtaltname').val(data[0].sAltName);
    $('#sTrnnumber').val(data[0].sTRN_No);
    $('#sType-id').val(data[0].iType);
    $('#sType').val(data[0].sType);
    $('#txtCreditdays').val(data[0].iCreditDays);
    $('#txtCrediamount').val(data[0].fCreditAmount);//here the field chamged
    $('#txtAddress').val(data[0].sAddress);
    $('#txtLatlan').val(data[0].sGeoLocation);
    $('#txtCity').val(data[0].sCity);
    $('#txtCountry').val(data[0].sCountry);
    $('#txtPinnumber').val(data[0].sPincode);
    $('#txtMobile').val(data[0].sMobile);
    $('#txtPhone').val(data[0].sPhone);
    $('#sFax').val(data[0].sFax);
    $('#sWebsite').val(data[0].sWebsite);
    $('#sContactperson').val(data[0].sContactPersonNo);
    $('#sEmail').val(data[0].sEmail);
    $('#bGroup').val(data[0].bGroup);
    $('#sParent-id').val(data[0].iParentId);
    $('#sParent').val(data[0].ParentName);
    openModal('GetMasterList');
}
$("#btnSummaryDelete").click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {
        console.log(mainTableList);
        if (mainTableList.length > 0) {
            $("label[for='msg']").text("Do you want to Delete '" + mainTableList.length + "' Row?");
            $("#modal-DeleteConfirm").show();
        }
        else {
            runError("Please Select Any Checkbox");
        }
    }

});

$("#btnyes").click(function () {
    $("#modal-DeleteConfirm").hide();
    var ids = mainTableList.join(',');
    console.log(ids); 
        $.ajax({
            url: '/Master/Delete',
            method: 'get',
            data: {
                sAPIName: "DeleteCustomer",
                iId: ids,
                iUser: userid
            },
            success: function (data) {
                data = JSON.parse(data);
                const sResultData = data.ResultData;
                const sMessageDescription = data.MessageDescription;
                if (sResultData > "0") {
                    runsuccess1(sMessageDescription);
                    $('#customerSummaryTable input[type="checkbox"]').prop('checked', false);
                }
                else if (sResultData==="0") {
                    // Handle failure case
                    runError(sMessageDescription);
                } else {
                    runError(sMessageDescription);
                }
                table.ajax.reload();
            }
        });
    
});
$("#btnno").click(function () {
    $("#modal-DeleteConfirm").hide();
    $('#customerSummaryTable input[type="checkbox"]').prop('checked', false);
    mainTableList = [];
});

$("#btnclosede").click(function () {
    $("#modal-DeleteConfirm").hide();
    $('#customerSummaryTable input[type="checkbox"]').prop('checked', false);
    mainTableList = [];

});
$(document).on('dblclick', '#customerSummaryTable tbody tr', function () {
    var row = $(this).closest('tr');
    var data = $('#customerSummaryTable').dataTable().fnGetData(row);
    mainTableList.push(data);
    $("#hdn_iId").val(data.iId);
    getCustomerDetails();

});
function truncateInput(input) {
    let inputValue = input.value;
    console.log('inputValue:', inputValue);
    if (!isNaN(inputValue)) {
        // If the parsed input value is greater than 99, reset it to 1
        if (parseInt(inputValue) > 99) {
            input.value = "0";
        } else if (inputValue.length > 2) {
            // Truncate the input value to the first 2 characters
            inputValue = inputValue.slice(0, 2);
            input.value = inputValue;
        }
    } else {
        input.value = "0";
    }
}

function copyValue() {
    var hdn_iIdValue = document.getElementById('hdn_iId').value;
    return hdn_iIdValue;
}

$(document).ready(function () {
    var titleId = $('#hdn_TitleId').val();
    var fCreditAmount = { "fCreditAmount": $('#txtCrediamount').val() };
    table = initializeDataTable('customerSummaryTable', '/Master/MasterSummaryDataTable', 'GetCustomerSummary', type);
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

    var txtCrediamount = document.getElementById("txtCrediamount");
    var previousValue = "";
    txtCrediamount.addEventListener("keydown", function (e) {
        if (e.key === '-' || e.key === '–') {
            e.preventDefault(); // Prevent the entry of a negative sign
        }
    });
    txtCrediamount.addEventListener("input", function () {
        // Get the entered value
        const input = txtCrediamount.value;

        // Check if the user pressed backspace or cleared the input
        if (previousValue && input.length < previousValue.length) {
            // Allow any input when removing characters
        } else {
            // Match the input against the regular expression pattern
            const match = input.match(/^(\d{0,6}(\.\d{0,2})?)?$/);

            //if (input.startsWith('-')) {
            //    txtCrediamount.value = input.slice(1); // Remove the leading negative sign
            //}
            // If the input does not match the pattern, prevent the user from adding more characters
            if (!match) {
                txtCrediamount.value = previousValue;
            }
        }

        // Store the current input value for comparison
        previousValue = txtCrediamount.value;
    });

    


});