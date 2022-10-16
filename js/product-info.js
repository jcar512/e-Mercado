const PRODUCT_ID = window.localStorage.getItem("productID");
const commentsList = document.querySelector("#product-comments");
const submitBtn = document.querySelector("#review-submit");
const addToCartBtn = document.querySelector("#addToCartBtn");
const newCommentText = document.querySelector("#new-comment-text");
let selectedStar;

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

function showProduct(product) {
  const indicators = document.querySelector("#carousel-indicators");
  const carousel = document.querySelector("#carousel-inner");
  const name = document.querySelector("#product-name");
  const cost = document.querySelector("#product-cost");
  const description = document.querySelector("#product-description");
  const category = document.querySelector("#product-category");
  const soldCount = document.querySelector("#product-sold-count");
  const relatedProductsImages = document.querySelector("#related-products");

  name.innerHTML = product.name;
  cost.innerHTML = product.currency + " " + product.cost;
  description.innerHTML = product.description;
  category.innerHTML = product.category;
  soldCount.innerHTML = product.soldCount;

  carousel.innerHTML += `
    <div class="carousel-item active">
      <img src="${product.images[0]}" class="d-block w-100" alt="...">
    </div>
    `;

  for (let i = 1; i < product.images.length; i++) {
    indicators.innerHTML += `
    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="${i}" aria-label="Slide ${
      i + 1
    }"></button>
    `;
    carousel.innerHTML += `
    <div class="carousel-item">
      <img src="${product.images[i]}" class="d-block w-100" alt="...">
    </div>
    `;
  }

  for (let content of product.relatedProducts) {
    relatedProductsImages.innerHTML += `
    <div class="related-prod-div" onclick="setProductID(${content.id})">
    <p class="related-p">${content.name}</p>
    <img class="image-related" src="${content.image}" alt="related-prod-img"">
    </div>
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

function addZeroLeft(num) {
  return num < 10 ? `0${num}` : num;
}

document.querySelector("#stars").onclick = (e) => {
  if (e.target.value) {
    selectedStar = e.target.value;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  let cart =
    JSON.parse(
      window.localStorage.getItem("cart" + window.localStorage.getItem("nombreUsuario"))
    ) || [];

  let newCartItem;

  let newCommentArray = JSON.parse(window.localStorage.getItem(PRODUCT_ID)) || [];

  usuario = document.getElementById("navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  document.getElementById("log-out-btn").addEventListener("click", () => {
    localStorage.removeItem("nombreUsuario");
  });

  //Cargo la información del producto
  getJSONData(PRODUCT_INFO_URL + PRODUCT_ID + EXT_TYPE).then((res) => {
    if (res.status === "ok") {
      let product = res.data;
      newCartItem = {
        id: product.id,
        name: product.name,
        count: 1,
        unitCost: product.cost,
        currency: product.currency,
        image: product.images[0],
      };
      showProduct(product);
    }
  });

  addToCartBtn.onclick = () => {
    const product = cart.find((product) => {
      return product.id === +PRODUCT_ID;
    });

    if (product === undefined) {
      cart.push(newCartItem);
    } else {
      product.count += 1;
    }

    window.localStorage.setItem(
      "cart" + window.localStorage.getItem("nombreUsuario"),
      JSON.stringify(cart)
    );
    window.location = "cart.html";
  };

  //Cargo los comentarios
  getJSONData(PRODUCT_INFO_COMMENTS_URL + PRODUCT_ID + EXT_TYPE).then((res) => {
    if (res.status === "ok") {
      let comments = res.data;
      loadComments(comments);
      loadComments(newCommentArray);
    }
  });

  submitBtn.addEventListener("click", (e) => {
    if (newCommentText.value != "" && selectedStar) {
      let today = new Date();

      let month = today.getMonth() + 1;
      let year = today.getFullYear();
      let date = today.getDate();

      let currentDate = `${year}-${month}-${date}`;

      let hours = addZeroLeft(today.getHours());
      let minutes = addZeroLeft(today.getMinutes());
      let seconds = addZeroLeft(today.getSeconds());

      let currentTime = `${hours}:${minutes}:${seconds}`;

      let currentDateTime = currentDate + " " + currentTime;

      newCommentArray.push({
        product: PRODUCT_ID,
        score: selectedStar,
        description: newCommentText.value,
        user: window.localStorage.getItem("nombreUsuario"),
        dateTime: currentDateTime,
      });
      window.localStorage.setItem(PRODUCT_ID, JSON.stringify(newCommentArray));
      commentsList.innerHTML += `
        <div class="customer-comment">
          <div class="name-and-date">
            <div class="profile-name">${window.localStorage.getItem("nombreUsuario")}</div>
            <div class="comment-date">${currentDateTime}</div>
          </div>
          <div class="rating">
            ${starRating(selectedStar)}
          </div>
          <div class="comment-description">
            <p>${newCommentText.value}</p>
          </div>
        </div>
        `;

      newCommentText.value = "";
      document.querySelectorAll(".stars-input").forEach((e) => {
        e.checked = false;
      });
      e.preventDefault();
    }
    e.preventDefault();
  });
});
