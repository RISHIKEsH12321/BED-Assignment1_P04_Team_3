document.addEventListener("DOMContentLoaded", async function() {
    let users = [];

    try {
        const response = await fetch("/admin/account");
        users = await response.json();
        displayUsers(users);
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }

    const idFilter = document.getElementById("Id");
    const roleFilter = document.getElementById("userType");
    const emailFilter = document.getElementById("email");
    const searchInput = document.getElementById("search");

    idFilter.addEventListener("change", filterUsers);
    roleFilter.addEventListener("change", filterUsers);
    emailFilter.addEventListener("change", filterUsers);
    searchInput.addEventListener("input", filterUsers);

    function displayUsers(filteredUsers) {
        const userList = document.getElementById("userList");
        userList.innerHTML = `
            <div class="account-header">
                <span>ID</span>
                <span>Name</span>
                <span>Email</span>
                <span>Phone</span>
                <span>Role</span>
            </div>
        `;

        filteredUsers.forEach((user) => {
            const accountDiv = document.createElement("div");
            accountDiv.classList.add("account-item");
            accountDiv.addEventListener('click', () => {
                window.location.href = `/account-profile/${user.user_id}`;
            });

            const idSpan = document.createElement("span");
            idSpan.textContent = user.user_id;
            accountDiv.appendChild(idSpan);

            const nameSpan = document.createElement("span");
            nameSpan.textContent = user.username;
            accountDiv.appendChild(nameSpan);

            const emailSpan = document.createElement("span");
            emailSpan.textContent = user.user_email;
            accountDiv.appendChild(emailSpan);

            const phoneSpan = document.createElement("span");
            phoneSpan.textContent = user.user_phonenumber;
            accountDiv.appendChild(phoneSpan);

            const roleSpan = document.createElement("span");
            roleSpan.textContent = user.user_role;
            accountDiv.appendChild(roleSpan);

            userList.appendChild(accountDiv);
        });
    }

    function filterUsers() {
        const idFilterValue = idFilter.value;
        const roleFilterValue = roleFilter.value;
        const emailFilterValue = emailFilter.value;
        const searchValue = searchInput.value.toLowerCase();
        let filteredUsers = users;

        if (idFilterValue !== "Id") {
            const [min, max] = idFilterValue.split('-').map(Number);
            filteredUsers = filteredUsers.filter(user => user.user_id >= min && user.user_id <= max);
        }

        if (roleFilterValue !== "Role") {
            filteredUsers = filteredUsers.filter(user => user.user_role === roleFilterValue);
        }

        if (emailFilterValue !== "email") {
            filteredUsers = filteredUsers.filter(user => user.user_email.endsWith(`@${emailFilterValue}`));
        }

        if (searchValue) {
            filteredUsers = filteredUsers.filter(user => user.username.toLowerCase().includes(searchValue));
        }

        displayUsers(filteredUsers);
    }
});
