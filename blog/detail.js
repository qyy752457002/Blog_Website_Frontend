/*
您提供的代码片段是用于从网页 URL 中提取查询参数的 JavaScript 代码。这里是对您的代码的详细解释：

1. **`URLSearchParams`**: 这是一个 Web API，提供了操作 URL 的查询字符串（query string）的方法。它简化了提取和处理查询参数的过程。

2. **`location.search`**: 这是 JavaScript 中 `location` 对象的一个属性，它返回 URL 中的查询字符串部分，包括前面的 `?` 符号。

3. **`new URLSearchParams(location.search)`**: 这行代码创建了一个新的 `URLSearchParams` 对象，用于解析当前网页 URL 的查询字符串。

4. **`let paramsObj = new URLSearchParams(location.search);`**: 这行代码实际上是在声明一个变量 `paramsObj`，
                                                                并将其初始化为解析当前网页 URL 查询字符串的 `URLSearchParams` 对象。

5. **`let aid = paramsObj.get("aid");`**: 这行代码使用 `get` 方法从 `paramsObj` 中检索键（key）为 `"aid"` 的查询参数的值。如果 URL 中有一个查询参数类似于 `?aid=value`，那么 `aid` 变量将会被赋值为 `value`。
                                          如果没有这样的查询参数，则 `aid` 变量将会是 `null`。

简单来说，您的代码是用来从网页的 URL 中提取名为 `"aid"` 的查询参数的值。这在处理基于 URL 查询参数的动态内容时非常有用，例如，在基于用户选择或其他条件改变页面内容的情况下。
*/

document.addEventListener('DOMContentLoaded', function () {
  const blogLink = document.querySelector('a.navbar-brand');

  blogLink.addEventListener('click', function (e) {
    const token = localStorage.getItem('token');
    if (!token) {
      e.preventDefault(); // 阻止默认行为，即阻止跳转
      alert('您尚未登录，请先登录！');
    } else {
      window.location.href = '../blog-user-admin/blog-list.html';
    }
  });
});

// 获取aid 文章的id
let paramsObj = new URLSearchParams(location.search);
let aid = paramsObj.get("aid");

http.get("/api/front/articles/" + aid).then((r) => {
  console.log(r.data);
  let at = document.querySelector(".article-title");
  at.innerHTML = r.data.data.title;

  let p = document.querySelector(".ibox p");
  p.innerHTML = r.data.data.content;
});

// 评论列表
async function loadCommentList() {
  let r = await http.get("/api/front/comments/articles/" + aid);
  console.log(r.data);
  let divArr = r.data.data.map(
    (v) => `
  <div class="social-feed-box">
                      <div class="social-avatar">
                        <a href="javascript:;" class="pull-left">
                          <img alt="image" src="${
                            baseURL + v.reply_user_id.headImgUrl
                          }" />
                        </a>
                        <div class="media-body">
                          <a href="javascript:;"> ${
                            v.reply_user_id.nickname
                          }</a>
                          <small class="text-muted">${v.createdAt}</small>
                        </div>
                      </div>
                      <div class="social-body">
                        <p>${v.content}</p>
                      </div>
                    </div> 
  
  `
  );
  document.querySelector(".com-list").innerHTML = divArr.join("");
}

// 发布评论
let sendBtn = document.querySelector(".send-btn");
let sendIpt = document.querySelector(".send-ipt");
sendBtn.onclick = async () => {
  let content = sendIpt.value;
  //   发布评论请求
  let r = await http.post("/api/front/comments", { content, article_id: aid });
  console.log(r.data);
  //   成功以后清空输入框
  sendIpt.value = "";
  loadCommentList();
};

loadCommentList();
