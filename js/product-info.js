const PRODUCT_ID = window.localStorage.getItem("productID");
const product = document.querySelector("#product");
let productArray = [];

function showProduct() {
  product.innerHTML = `
    <div>
      <div class="prod-title">
        <h2>${productArray.name}</h2>
      </div>
      <hr id="prod-hr">
      <div class="prod-info">
        <p class="prod-info-content"><strong>Precio</strong></p>
        <p>${productArray.currency} ${productArray.cost}</p>
      </div>
      <div class="prod-info">
        <p class="prod-info-content"><strong>Descripción</strong></p>
        <p>${productArray.description}</p>
      </div>
      <div class="prod-info">
        <p class="prod-info-content"><strong>Categoría</strong></p>
        <p>${productArray.category}</p>
      </div>
      <div class="prod-info">
        <p class="prod-info-content"><strong>Cantidad de vendidos</strong></p>
        <p>${productArray.soldCount}</p>
      </div>
      <div>
        <p class="prod-info-content"><strong>Imágenes ilustrativas</strong></p>
        <div id="images"><div>
      </div>
    </div>
    `;
  console.log(productArray.images);
  for (let image of productArray.images) {
    document.querySelector("#images").innerHTML += `
    <img src="${image}" class="image">
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  usuario = document.getElementById("usuario");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  getJSONData(PRODUCT_INFO_URL + PRODUCT_ID + EXT_TYPE).then((res) => {
    if (res.status === "ok") {
      productArray = res.data;
      showProduct();
    }
  });
});
