document.getElementById("profile_pic_navbar").addEventListener("click", function() {
    let userId = sessionStorage.getItem("user_id");
    let adminId = sessionStorage.getItem("admin_id")

    if (userId && adminId) {
        window.location.href = "/viewUser";
    } else if (userId) {
        window.location.href = `/profile/${userId}`; //simulating
    } else {
        window.location.href = "/accountselection";
    }
});