const URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
const cartList = document.querySelector("#info-container");
const items = document.querySelector("#items");
const subtotalAll = document.querySelector("#subtotal-all");
let cartArray = [];

function showCart(array) {
  htmlToAppend = "";
  itemsNumToAppend = 0;
  subtotalAllToAppend = 0;

  for (i = 0; i < array.length; i++) {
    itemsNumToAppend += array[i].count;
    if (array[i].currency !== "USD") {
      subtotalAllToAppend += array[i].count * Math.round(array[i].unitCost / 42);
    } else {
      subtotalAllToAppend += array[i].count * array[i].unitCost;
    }

    htmlToAppend += `
      <div class="cart-content">
        <div class="cart-content-item">                    
          <div class="cart_v2_table" id="vendor-container-1">
            <div class="item_container" id="cart-item-row">
              <div class="img">
                  <img
                    class="item_image_product"
                    src="${array[i].image}"
                    alt="${array[i].name}"
                  />
                </a>
              </div>

              <div class="item_general">
                <div class="name-and-qty">
                  <h2 class="item_name">${array[i].name}</h2>

                  <div class="item_operations">
                    <div class="item_cart_qty">
                      <button
                        type="button"
                        name="update_cart_action"
                        value="update_qty"
                        title="Actualizar"
                        data-value="1"
                        class="button btn-update restar_uno"
                        onclick="subtractOne('${array[i].id}')"
                      >
                        <span>-</span>
                      </button>
                      <input
                        value="${array[i].count}"
                        size="4"
                        title="Cantidad"
                        class="input-text qty"
                        maxlength="12"
                        id="${array[i].id}input"
                        onchange="setQty('${array[i].id}')"
                      />
                      <button
                        type="button"
                        name="update_cart_action"
                        value="update_qty"
                        title="Actualizar"
                        data-value="1"
                        class="button btn-update sumar_uno"
                        onclick="oneMore('${array[i].id}')"
                      >
                        <span>+</span>
                      </button>                      
                    </div>                    
                    <button 
                      class="delete-bton" 
                      onclick="removeItemAt(${i})"
                      ><i class="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
                <div class="item_price">
                  <span class="cart-price" 
                  id="${array[i].id}price">${array[i].currency}
                  ${array[i].unitCost * array[i].count}</span></br>
                  <small>(${array[i].currency} ${array[i].unitCost} </br>c/u)</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  cartList.innerHTML = htmlToAppend;
  items.innerHTML = itemsNumToAppend;
  subtotalAll.value = subtotalAllToAppend;
  subtotalAll.innerHTML = subtotalAllToAppend;
}

function subtractOne(id) {
  const product = cartArray.find((product) => {
    return product.id === +id;
  });
  if (product.count > 1) {
    product.count -= 1;
    window.localStorage.setItem(
      "cart" + window.localStorage.getItem("nombreUsuario"),
      JSON.stringify(cartArray)
    );
    showCart(cartArray);
  }
}

function oneMore(id) {
  const product = cartArray.find((product) => {
    return product.id === +id;
  });
  product.count += 1;
  window.localStorage.setItem(
    "cart" + window.localStorage.getItem("nombreUsuario"),
    JSON.stringify(cartArray)
  );
  showCart(cartArray);
}

function setQty(id) {
  inputQty = document.getElementById(id + "input");
  const product = cartArray.find((product) => {
    return product.id === +id;
  });
  if (inputQty.value >= 1) {
    product.count = +inputQty.value;
    window.localStorage.setItem(
      "cart" + window.localStorage.getItem("nombreUsuario"),
      JSON.stringify(cartArray)
    );
    showCart(cartArray);
  } else {
    product.count = 1;
    window.localStorage.setItem(
      "cart" + window.localStorage.getItem("nombreUsuario"),
      JSON.stringify(cartArray)
    );
    showCart(cartArray);
  }
}

function removeItemAt(index) {
  const newArray = [...cartArray.slice(0, index), ...cartArray.slice(index + 1, cartArray.length)];
  cartArray = newArray;
  window.localStorage.setItem(
    "cart" + window.localStorage.getItem("nombreUsuario"),
    JSON.stringify(cartArray)
  );
  showCart(cartArray);
}

document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  usuario = document.getElementById("navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  document.getElementById("log-out-btn").addEventListener("click", () => {
    localStorage.removeItem("nombreUsuario");
  });

  cartArray =
    JSON.parse(
      window.localStorage.getItem("cart" + window.localStorage.getItem("nombreUsuario"))
    ) || [];

  getJSONData(URL).then(function (resultObj) {
    if (resultObj.status === "ok") {
      let car = resultObj.data.articles[0];

      const product = cartArray.find((product) => {
        return product.id === car.id;
      });

      if (product === undefined) {
        cartArray.push(car);
      }

      showCart(cartArray);
    }
  });

  document.querySelector("#premium").onclick = () => {
    subtotalAll.innerHTML = subtotalAll.value + Math.round(subtotalAll.value * 0.15);
  };

  document.querySelector("#express").onclick = () => {
    subtotalAll.innerHTML = subtotalAll.value + Math.round(subtotalAll.value * 0.07);
  };

  document.querySelector("#standard").onclick = () => {
    subtotalAll.innerHTML = subtotalAll.value + Math.round(subtotalAll.value * 0.05);
  };
});
