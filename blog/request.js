let baseURL = "http://127.0.0.1:3000";

// 建立 axios instance
let http = axios.create({
  baseURL,
});

// 添加请求拦截器
http.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    console.log(config.headers);
    // 从 localStorage 中 获取 token
    let token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
