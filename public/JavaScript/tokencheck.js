document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (token) {
        const decodedToken = parseJwt(token);

        if (decodedToken) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            if (decodedToken.exp < currentTime) {
                console.log('Token has expired. Redirecting to login page.');
                localStorage.clear();
                showCustomAlert("Timed Out");
                setTimeout(function() {
                    closeCustomAlert();
                    window.location.href = "/accountselection";
                }, 3000); // Redirect after 3 seconds
            }
        } else {
            console.error('Failed to decode token');
        }
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

function showCustomAlert(message) {
    const customAlertHtml = `
        <div id="customAlert" class="custom-alert">
            <div class="custom-alert-content">
                <span class="custom-alert-close" onclick="closeCustomAlert()">&times;</span>
                <p id="customAlertMessage">${message}</p>
            </div>
        </div>
    `;

    // Append custom alert HTML to the body
    document.body.insertAdjacentHTML('beforeend', customAlertHtml);
}

function closeCustomAlert() {
    const customAlert = document.getElementById('customAlert');
    if (customAlert) {
        customAlert.remove();
    }
}
