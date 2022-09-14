const PRODUCT_ID = window.localStorage.getItem("productID");
const commentsList = document.querySelector("#product-comments");

function showProduct(products) {
  let name = document.querySelector("#product-name");
  let cost = document.querySelector("#product-cost");
  let description = document.querySelector("#product-description");
  let category = document.querySelector("#product-category");
  let soldCount = document.querySelector("#product-sold-count");

  name.innerHTML = products.name;
  cost.innerHTML = products.currency + " " + products.cost;
  description.innerHTML = products.description;
  category.innerHTML = products.category;
  soldCount.innerHTML = products.soldCount;

  for (let image of products.images) {
    document.querySelector("#images").innerHTML += `
    <img src="${image}" class="image">
    `;
  }
}

function loadComments(comments) {
  for (let comment of comments) {
    commentsList.innerHTML += `
    <div class="customer-comment">
      <div class="name-and-date">
        <div class="profile-name">${comment.user}</div>
        <div class="comment-date">${comment.dateTime}</div>
      </div>
      <div class="rating">
        ${starRating(comment.score)}
      </div>
      <div class="comment-description">
        <p>${comment.description}</p>
      </div>
    </div>
    `;
  }
}

function starRating(rate) {
  htmlToAppend = "";

  for (i = 0; i < 5; i++) {
    if (i < rate) {
      htmlToAppend += `
      <span class="fa fa-star checked"></span>
      `;
    } else {
      htmlToAppend += `
      <span class="fa fa-star"></span>
      `;
    }
  }

  return htmlToAppend;
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  usuario = document.getElementById("usuario");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  //Cargo la información del producto
  getJSONData(PRODUCT_INFO_URL + PRODUCT_ID + EXT_TYPE).then((res) => {
    if (res.status === "ok") {
      let productArray = res.data;
      showProduct(productArray);
    }
  });

  //Cargo los comentarios
  getJSONData(PRODUCT_INFO_COMMENTS_URL + PRODUCT_ID + EXT_TYPE).then((res) => {
    if (res.status === "ok") {
      let comments = res.data;
      loadComments(comments);
    }
  });
});
