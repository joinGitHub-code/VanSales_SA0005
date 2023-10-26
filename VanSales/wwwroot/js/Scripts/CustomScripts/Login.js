
var iUser = $('#hdn_SessionUID').val();
console.log(iUser);
$('#btnLogin').click(function (evt) {
    Login();
});


$('#sPass').blur(function (evt) {
    $('#btnLogin').focus();
});


function Login() {
   
    var sLogin = document.getElementById("sLogin").value;
    var sPass = document.getElementById("sPass").value;
   
    var RememberMe = $('#RememberMe').prop("checked");

    if (RememberMe == true)
    {
        $.cookie('username', sLogin, { expires: 14 });
        $.cookie('password', sPass, { expires: 14 });
        $.cookie('remember', true, { expires: 14 });
    }
    else
    {
        $.cookie('username', null);
        $.cookie('password', null);
        $.cookie('remember', null);
    }

   
    if ((sLogin != "") && (sPass != "")) {       
        
        $.ajax({
            url: '/Main/GetLogin', 
            data: { sLogin: sLogin, sPass: sPass, RememberMe: RememberMe },
            
            success: function (data) {
                //alert(JSON.stringify(data))
                const res = data.split(",");               
                var sApiResultiId = res[0];
                var sApiResultUserExists = res[1];
                if (sApiResultiId >= 0)
                {
                    $("#hdn_SessionUID").val(data);                   
                    window.location = "/Main/Index";  
                    
                    $('#ErrorInfo').text("");
                    $('#SuccessInfo').text("");                   
                }
                else if (sApiResultiId == -1) {
                    //$('#ErrorInfo').text("Invalid Credentials.. Login Failed..!!");
                    $('#ErrorInfo').text(sApiResultUserExists);
                }
               
                else {
                    $('#ErrorInfo').text("Invalid Username Or Password");

                }


            },
            error: function (err) {                
                alert("Failed..!! Exception..");
            }
        });
    }
    else {
        $('#ErrorInfo').text("Enter Login Name and Password..!!");
    }
}



$(document).ready(function () {
    $('#sLogin').focus();

    var remember = $.cookie('remember');
    //alert("remember " + remember)
    if (remember == 'true')
    {
       
        var username = $.cookie('username');
        var password = $.cookie('password');
        // autofill the fields
        $('#sLogin').val(username);
        $('#sPass').val(password);
        $('#RememberMe').attr('checked', true);//#login-check checkbox id..
    }


});

