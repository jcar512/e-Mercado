//Chequeo que haya un usuario logeado
if (window.localStorage.getItem("nombreUsuario") === null) {
  window.location.href = "login.html";
}

const URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";
const cartList = document.querySelector("#info-container");
const items = document.querySelector("#items");
const subtotalAll = document.querySelector("#subtotal-all");
const totalToPay = document.querySelector("#total-amount");
const tax = document.querySelector("#shipping-tax");
let cartArray = [];
let shippingTax = 0.05;
let totalPrice;

//User
const userID = window.localStorage.getItem("nombreUsuario");
const users = JSON.parse(window.localStorage.getItem("users"));
const currentUser = users[userID];
//Img de perfil
const navbarProfImg = document.querySelector("#nav-profile-img");

//Modal
const modal = document.getElementById("myModal");
const btn = document.getElementById("myBtn");
const closeBtn = document.querySelector("#close-btn");
const cardNum = document.querySelector("#card-num");
const cardSegCode = document.querySelector("#card-seg-code");
const cardExpiration = document.querySelector("#card-expiration");
const bankAcc = document.querySelector("#bank-acc");
const form = document.querySelector("#form");

// When the user clicks on the button, open the modal
btn.onclick = function (e) {
  e.preventDefault();
  modal.style.display = "block";
};

// When the user clicks on closeBtn, close the modal
closeBtn.onclick = function () {
  modal.style.display = "none";
};

//https://nosir.github.io/cleave.js/

const cleaveStreetNum = new Cleave("#streetNum", {
  numericOnly: true,
  blocks: [4],
});

const cleaveCC = new Cleave("#card-num", {
  creditCard: true,
  delimiter: "-",
  onCreditCardTypeChanged: function (type) {
    const cardBrand = document.getElementById("cardBrand"),
      visa = "fab fa-cc-visa",
      mastercard = "fab fa-cc-mastercard";

    switch (type) {
      case "visa":
        cardBrand.setAttribute("class", visa);
        break;
      case "mastercard":
        cardBrand.setAttribute("class", mastercard);
        break;
      default:
        cardBrand.setAttribute("class", "");
        break;
    }
  },
});

const cleaveDate = new Cleave("#card-expiration", {
  date: true,
  datePattern: ["m", "y"],
});

const cleaveCCV = new Cleave("#card-seg-code", {
  numericOnly: true,
  blocks: [3],
});

const cleaveBankAcc = new Cleave("#bank-acc", {
  numericOnly: true,
  blocks: [17],
});

//-----------------------------------------------------

//Añade mensajes de error y bordes en rojo
function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  element.classList.remove("is-valid");
  element.classList.add("is-invalid");
  errorDisplay.innerText = message;
}

//Quita mensaje de error y bordes rojos
function setSuccess(element) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  element.classList.remove("is-invalid");
  element.classList.add("is-valid");
  errorDisplay.innerText = "";
}

//Llama a setError por cada error pasado
function showErrors(errors) {
  Object.entries(errors).forEach(([input, error]) =>
    setError(document.getElementById(input), error)
  );
}

//Validaciones
function validate({ street, streetNum, streetCorner }) {
  const errors = {};

  if (street === "") {
    errors.street = "Debe ingresar la calle.";
  } else {
    setSuccess(document.getElementById("street"));
  }

  if (streetNum === "") {
    errors.streetNum = "Debe ingresar el número.";
  } else {
    setSuccess(document.getElementById("streetNum"));
  }

  if (streetCorner === "") {
    errors.streetCorner = "Debe ingresar la esquina.";
  } else {
    setSuccess(document.getElementById("streetCorner"));
  }
  return errors;
}

//Carrito vacío
function noItems() {
  document.querySelector("main").innerHTML = `
    <div class="placeholder">
      <h1>Tu carrito está vacío</h1>
      <p>¿No sabes qué comprar? <a href="categories.html">¡Cientos de productos te esperan!</a></p>
    </div>
    `;
}

//Mostrar carrito
function showCart(array) {
  if (array.length === 0) {
    noItems();
    return;
  }

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
  totalPrice = subtotalAllToAppend;
  subtotalAll.innerHTML = totalPrice;
  tax.innerHTML = Math.round(totalPrice * shippingTax);
  totalToPay.innerHTML = totalPrice + Math.round(totalPrice * shippingTax);
}

/* ---------------------Funciones de suma/resta--------------------------- */
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
/* ---------------------------------------------------------------------- */

//Función para borrar del carrito
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
  usuario = document.querySelector("#navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  document.querySelector("#log-out-btn").onclick = () => {
    localStorage.removeItem("nombreUsuario");
  };

  if (currentUser.profileImg !== "") {
    navbarProfImg.src = currentUser.profileImg;
  }

  //Cargo el carrito del local storage
  cartArray =
    JSON.parse(
      window.localStorage.getItem("cart" + window.localStorage.getItem("nombreUsuario"))
    ) || [];

  showCart(cartArray);

  document.querySelector("#payment-method").onclick = (e) => {
    if (+e.target.value === 1) {
      document.querySelector("#payment-method-selected").innerText = "Tarjeta de crédito";

      document.querySelector("#card-div").style.display = "flex";
      document.querySelector("#bank-acc-div").style.display = "none";

      //Remuevo el disabled de los input de tarjeta en caso de que lo haya
      cardNum.removeAttribute("disabled");
      cardSegCode.removeAttribute("disabled");
      cardExpiration.removeAttribute("disabled");

      //Añado required a los inputs de tarjeta
      cardNum.setAttribute("required", "");
      cardSegCode.setAttribute("required", "");
      cardExpiration.setAttribute("required", "");

      //Remuevo el required del input de cuenta bancaria
      bankAcc.removeAttribute("required");

      //Deshabilito el input de cuenta bancaria
      bankAcc.setAttribute("disabled", "");

      //Dejo el input de cuenta bancaria en blanco
      bankAcc.value = "";
    }

    if (+e.target.value === 2) {
      document.querySelector("#payment-method-selected").innerText = "Transferencia bancaria";

      document.querySelector("#card-div").style.display = "none";
      document.querySelector("#bank-acc-div").style.display = "flex";

      //Remuevo el disabled del input de cuenta bancaria en caso de que lo haya
      bankAcc.removeAttribute("disabled");

      //Añado required al input de cuenta bancaria
      bankAcc.setAttribute("required", "");

      //Remuevo el required de los input de tarjeta
      cardNum.removeAttribute("required");
      cardSegCode.removeAttribute("required");
      cardExpiration.removeAttribute("required");

      //Deshabilito los inputs de tarjeta
      cardNum.setAttribute("disabled", "");
      cardSegCode.setAttribute("disabled", "");
      cardExpiration.setAttribute("disabled", "");

      //Dejo los inputs de tarjeta en blanco
      cardNum.value = "";
      cardSegCode.value = "";
      cardExpiration.value = "";
      cardBrand.setAttribute("class", "");
    }
  };

  //Botón para cerrar el alert
  document.querySelector("#closebtn").onclick = () => {
    let div = document.querySelector("#closebtn").parentElement;
    div.style.opacity = "0";
    setTimeout(function () {
      div.style.display = "none";
    }, 600);
  };

  //Botón finalizar compra
  form.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = {
      street: formData.get("street"),
      streetNum: formData.get("streetNum"),
      streetCorner: formData.get("streetCorner"),
    };

    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
    }

    if (!document.getElementById("modal-form").checkValidity()) {
      setError(btn.parentElement, "Debe ingresar una forma de pago correcta");
    } else {
      setSuccess(btn.parentElement);
    }

    if (
      document.getElementById("form").checkValidity() &&
      document.getElementById("modal-form").checkValidity()
    ) {
      // mando datos al servidor
      document.querySelector("#alert").style.display = "block";
      setTimeout(function () {
        document.querySelector("#alert").classList.add("show");
      }, 30);

      cartArray = [];
      window.localStorage.setItem(
        "cart" + window.localStorage.getItem("nombreUsuario"),
        JSON.stringify(cartArray)
      );
      showCart(cartArray);
    }
  };

  //Radios envío
  document.querySelector("#shipping-type").onclick = (e) => {
    if (e.target.value) {
      shippingTax = e.target.value;
      tax.innerHTML = Math.round(totalPrice * shippingTax);
      totalToPay.innerHTML = totalPrice + Math.round(totalPrice * shippingTax);
    }
  };
});
