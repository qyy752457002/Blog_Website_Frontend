let pagenum = 1;
const pagesize = 2;

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

async function loadList() {
  try {
    let r = await http.get("/api/front/articles", {
      params: { pagenum, pagesize },
    });
    console.log(r);
    let artArr = r.data.data;
    let liArr = artArr.map((v) => createArticleHTML(v));

    /*
      这段 JavaScript 代码使用了 `document.querySelector` 和 `insertAdjacentHTML` 方法来向一个 HTML 文档的特定元素中动态添加内容。
      让我们逐步解释它的含义和作用：

      1. **`document.querySelector(".art-list")`**: 这是一个 DOM（文档对象模型）方法，用于选择页面上第一个与指定选择器匹配的元素。
            在这个例子中，它选择了类名为 `art-list` 的元素。这通常是一个 HTML 列表元素，如 `<ul>` 或 `<ol>`。

      2. **`insertAdjacentHTML('beforeend', liArr.join(""))`**: 
        - `insertAdjacentHTML` 方法用于将指定的文本作为 HTML 解析，并将生成的节点插入到文档中的指定位置。
        - `'beforeend'` 是这个方法的一个位置参数，表示将内容插入到当前元素内部的末尾，也就是所有子元素之后。
        - `liArr.join("")`: 这里假设 `liArr` 是一个包含 HTML 字符串的数组，
            例如 `<li>` 元素的数组。`join("")` 方法将这个数组的所有元素连接成一个单一的字符串，数组中每个元素之间没有分隔符（因为传递给 `join` 的参数是空字符串）。

      综合来看，这段代码的作用是将一个由 `<li>` 元素组成的列表（或其他 HTML 元素）添加到页面上一个指定的类名为 `art-list` 的元素内部的末尾。
      这是动态更新网页内容的一种常见方式，特别是在处理由用户交互或异步请求（如 AJAX 调用）生成的数据时。
    */

    document.querySelector(".art-list").insertAdjacentHTML('beforeend', liArr.join(""));
  } catch (error) {
    console.error("Error loading list:", error);
    // 这里可以添加错误提示给用户
  }
}

function createArticleHTML(article) {
  return `
    <div class="col-sm-12">
      <div class="ibox">
        <div class="ibox-content">
          <a href="detail.html?aid=${article._id}" class="btn-link">
            <h2>${article.title}</h2>
          </a>
          <div class="small m-b-xs">
            <strong>${article.author ? article.author.nickname : ""}</strong>
            <span class="text-muted"><i class="fa fa-clock-o"></i> ${article.createdAt}</span>
          </div>
          <p>${article.content}</p>
          <div class="row">
            <div class="col-md-1"><i class="fa fa-eye"> </i> ${article.views} 浏览</div>
            <div class="col-md-1"><i class="fa fa-comments-o"> </i> ${article.coms.length} 评论</div>
          </div>
        </div>
      </div>
    </div>`;
}

// 首次加载文章列表
loadList();

// 加载更多
let loadMoreBtn = document.querySelector(".pager a");
loadMoreBtn.onclick = () => {
  pagenum++;
  loadList();
};

