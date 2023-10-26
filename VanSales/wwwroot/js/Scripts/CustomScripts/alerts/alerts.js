
var Msg = "";
var Link = "";
var resLink="";
function runError(Msg) {

    Swal.fire({
        position: 'top-end',
        icon: 'error',
        //title: 'Oops...',
        text: Msg

    });

}

function runConfirm(Link,resLink)
{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
    }).then((result) => {


        

       
        if (
            /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
            Swal.fire(
              'Cancelled',
              'Your data is safe :)',
              'error'
            )
        }
        else {


            $.ajax({
                url: Link,
                type: "get",
                success: function (data) {

                    result = data;
                    if (result == 1) {

                        Swal.fire(
                           'Deleted!',
                           'Your file has been deleted.',
                           'success'
                         ).then(function () {
                             window.location = resLink;
                         });

                    }
                    else if (result === -1) {
                        Swal.fire(
                          'Cancelled',
                          'Have another transaction :)',
                          'error'
                        )
                    }
                    else {
                        Swal.fire(
                          'Cancelled',
                         result,
                          'error'
                        )
                    }


                }

            });
        }
    })

}

function runsuccess(Msg,Link) {

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: Msg,
        showConfirmButton: false,
        timer: 1500
    }).then(function () {
            window.location = Link;
        });


}


function runsuccess1(Msg) {

    Swal.fire({
        position: 'center', /*position: 'top-end'*/
        icon: 'success',
        title: Msg,
        showConfirmButton: false,
        timer: 1500
    });


}









function confirmDetete(ctl, event) {

    debugger;
    event.preventDefault();
    var defaultAction = $(ctl).prop("href");
    swal({
        title: "Are you sure?",
        text: "You will  be able to add it back again!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            if (isConfirm) {
                $.get(ctl);
                swal({
                    title: "success",
                    text: "Deleted",
                    confirmButtonText: "ok",
                    allowOutsideClick: "true"
                }, function () { window.location.href = ctl })

                // $("#signupform").submit();
            } else {
                swal("Cancelled", "Is safe :)", "success");

            }
        });
}