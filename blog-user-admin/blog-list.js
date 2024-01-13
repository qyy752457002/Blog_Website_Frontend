let username = localStorage.getItem("username");
let nickname = localStorage.getItem("nickname");
let headImgUrl = localStorage.getItem("headImgUrl");

// 用户头像和用户名 昵称显示
let headImg = document.querySelector(".social-avatar img");
// base url = "http://127.0.0.1:3000" 
// headImgUrl = "/images/" + file.filename
headImg.src = baseURL + headImgUrl;

// 更新用户名和昵称显示部分
let mediaBody = document.querySelector(".social-avatar .media-body");
mediaBody.innerHTML = `用户名：${username}<br>昵称：${nickname}`;

// 给发布按钮添加一个点击事件，点击的时候获取输入框的值   富文本编辑器的值
let sendBtn = document.querySelector(".send");
let ipt = document.querySelector(".form-control");
sendBtn.onclick = function () {
  let content = editor.getHtml();
  let title = ipt.value;

  // 请求头中传入token值
  http
    .post("/api/articles", { content, title })
    .then((r) => {
      layer.msg(r.data.msg);
      ipt.value = "";
      editor.setHtml("");

      // 刷新博客列表
      loadBlogList();
    })
    .catch((err) => {
      console.log(err);
    });
};

// 博客列表
async function loadBlogList() {
  let uid = localStorage.getItem("uid");
  let r = await http.get("/api/articles/users/" + uid);
  let blogArr = r.data.data;
  let trArr = blogArr.map(
    (v) => `
    <tr class="gradeX">
      <td><a href="../blog/detail.html?aid=${v._id}">${v.title}</a></td>
      <td>${v.createdAt}</td>
      <td class="center">${v.updatedAt}</td>
      <td class="center">${v.views}</td>
      <td class="center">${v.coms.length}</td>
      <td class="center">
        <button type="button" class="btn btn-danger del" data-id="${v._id}">删除</button>
      </td>
      <td class="center">
        <a href="blog-edit.html?aid=${v._id}" type="button" class="btn btn-danger">编辑</a>
      </td>
    </tr>
    `
  );
  document.querySelector("tbody").innerHTML = trArr.join("");
}

// 打开页面加载博客列表
loadBlogList();

// 删除功能--删除按钮添加点击事件
let tbody = document.querySelector("tbody");
tbody.onclick = async function (evt) {
  if (evt.target.classList.contains("del")) {
    let delBtn = evt.target;
    let aid = delBtn.dataset.id;
    let r = await http.delete("/api/articles/" + aid);
    layer.msg("删除成功");
    loadBlogList();
  }
};

