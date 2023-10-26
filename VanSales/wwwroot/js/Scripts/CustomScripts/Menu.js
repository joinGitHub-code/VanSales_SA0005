var iUser = $("#hdn_SessionUID").val();
var iScreenId = 0;
//iUser = 0;
//alert("iUser" + iUser);
//$("#lblname").text($("#hdn_SessionUName").val());
//for (var i = 0; i <= 30; i++) {
//    $("#li" + i).hide();
//}

$.ajax({
    url: '/Settings/GetRoleDetails',
    data: { sAPIName: "GetMenu", iUser: iUser },
    method: 'get',
    dataType: 'json',
    success: function (data) {
        //alert("GetMenu: " + JSON.stringify(data));
        if (data.ResultData != "") {
            data = JSON.parse(data.ResultData);
            //alert("GetMenu: " + "" + data.length);
           // alert("GetMenu: " + JSON.stringify(data));
            //console.log("Menu ResultData" + JSON.stringify(data));
            //console.log("iUser" + iUser);
            if (data != undefined) {
                if (data.length > 0) {
                  
                    var maxrolelength = data[0].maxrolelength;
                    //var maxrolelength = data.length;
                    //alert("maxrolelength" + maxrolelength);
                    for (var i = 0; i <= maxrolelength; i++) {
                       // alert("in for " + data[i].iId);
                        $("#li" + i).hide();
                        
                    }
                    for (var i = 0; i < data.length; i++) {
                        iScreenId = data[i].iId;
                        //alert("iScreenId" + iScreenId);
                        $("#li" + iScreenId).show();
                    }
                }
            }
        }
        else {
            if (iUser == 0) {
                window.location = "/Main/Login";
            }
        }
        

    }
});


function LogOut() {
    if (iUser == 0) {
        window.location = "/Main/Login";
    }
    else {
        $("label[for='msgLogOut']").text("Are you sure you want to log out?");
        $("#modal-DeleteConfirmLogOut").show();
    }
}

$("#btnyesLogOut").click(function () {
    $("#modal-DeleteConfirmLogOut").hide();
    window.location = "/Main/LogOut";
   // window.location = "/Attendance/Login";

});

$("#btnnoLogOut").click(function () {
    $("#modal-DeleteConfirmLogOut").hide();
});

$("#btnclosedeLogOut").click(function () {
    $("#modal-DeleteConfirmLogOut").hide();
});