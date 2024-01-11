// logout.js

// 你可能需要一个按钮或其他机制来触发登出操作
let logoutButton = document.querySelector(".logout-button");

logoutButton.onclick = function () {
    // 清除本地存储中的用户信息
    localStorage.removeItem("username");
    localStorage.removeItem("nickname");
    localStorage.removeItem("uid");
    localStorage.removeItem("headImgUrl");
    localStorage.removeItem("token");

    // 可选：发送一个请求到后端以告知用户已登出（如果后端需要处理）
    // 假设后端登出API是 /api/logout
    http.get('/api/users/logout'); 

    // 跳转到登录页面或主页
    location.href = "../blog-user-admin/login.html";
};
