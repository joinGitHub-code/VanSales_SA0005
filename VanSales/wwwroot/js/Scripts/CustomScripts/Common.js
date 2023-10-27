
$("#btnClose").click(function () {
    if (userid == 0) {
        window.location = "/Main/Login";
    }
    else {

        window.location = '/Main/Index';
    }
});
function openModal(modalId) {
    $("#" + modalId).show();
}
function closeModal(modalId) {
    $("#" + modalId).hide();
}
$('#btnProperty').click(function () {
    if (mainTableList.length > 0) {
        openModal('property_modal');
    }
    else {
        runError("Please Select Any Checkbox");
    }
});

$("#btnPSave").click(function () {
    var status = $("input:radio[name=prop]:checked").val()
    var ids = mainTableList.join(',');
    $.ajax({
        url: '/Master/UpdateData',
        type: "GET",
        data: {
            sAPIName: 'SetProperty', iId: ids, iMenuId: menuId,
            iStatus: status
        },

        success: function (data) {
            successCallBack(data);
            closeModal('property_modal');
        }


    });

});
function successCallBack(data) {
    data = JSON.parse(data);
    if (data.Status == "Success") {
        runsuccess1("Success");
    }
    else {

        runError(data.MessageDescription);
    }
    table.ajax.reload();


}
$('#btnclss').click(function () {
    closeModal('property_modal');
})

function initializeDataTable(tableId, apiSource, sApiName, menuId, parentId) {

    return $('#' + tableId).DataTable({
        "sAjaxSource": apiSource,
        "fnServerParams": function (data) {

            // Additional parameters can be added here if needed
            data.push({ "name": "sAPIName", "value": sApiName }, { name: "iMaster", "value": menuId }, { name: "iParent", "value": parentId });

        },
        "initComplete": function (settings, json) {
            $("#" + tableId).wrap("<div style='overflow:auto; width:100%;max-height:350px; position:relative;'></div>");
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
        "columns": [
            {
                'width': '5%',
                'targets': 0,
                'searchable': false,
                'orderable': false,
                'autoWidth': false,
                'render': function (data, type, full, meta) {
                    return '<input type="checkbox" name="id[]" value=""  ' + $('<div/>').text(data).html() + '">';
                }

            },
            {

                "data": "sName",
                "autoWidth": false,
                'orderable': false,
                "searchable": true,
                "width": '30%',
                "render": function (data, type, full, meta) {
                    if (full.bGroup) {
                        return '<strong>' + full.sName + '</strong>';
                    } else {
                        return data;
                    }
                }
            },
            {
                "data": "sCode",
                "autoWidth": false,
                'orderable': false,
                "searchable": true,
                "width": '30%'
            },
            {
                "data": "sAltName",
                "autoWidth": false,
                'orderable': false,
                "searchable": true,
                "width": '30%'
            },

        ]//,
        //"rowReorder": {
        //    selector: 'tr' // Selector for the rows to be reordered
        //}
    });
}
