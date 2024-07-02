document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            localStorage.setItem('user_id', decodedToken.user_id);
            localStorage.setItem('username', decodedToken.username);
            if(decodedToken.admin_id){
                localStorage.setItem('admin_id', decodedToken.admin_id)
            }
            const expirationDate = new Date(decodedToken.exp * 1000); // Convert to milliseconds
            localStorage.setItem('details', expirationDate.toLocaleString());
        } else {
            console.error('Failed to decode token');
        }
    }
});


document.getElementById("profile_pic_navbar").addEventListener("click", function() {
    let userId = localStorage.getItem("user_id");
    let adminId = localStorage.getItem("admin_id")

    if (userId && adminId) {
        window.location.href = "/admin/viewUser";
    } else if (userId) {
        window.location.href = `/profile/${userId}`; //simulating
    } else {
        window.location.href = "/accountselection";
    }
});



function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Invalid token:", error);
        return null;
    }
}