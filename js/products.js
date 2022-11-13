//Chequeo que haya un usuario logeado
if (window.localStorage.getItem("nombreUsuario") === null) {
  window.location.href = "login.html";
}

const ORDER_ASC_BY_COST = "09";
const ORDER_DESC_BY_COST = "90";
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let initial;

//User
const userID = window.localStorage.getItem("nombreUsuario");
const users = JSON.parse(window.localStorage.getItem("users"));
const currentUser = users[userID];
//Img de perfil
const navbarProfImg = document.querySelector("#nav-profile-img");

function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

function showProductList() {
  let htmlContentToAppend = "";

  for (let product of currentProductsArray) {
    if (
      (minCount == undefined || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
      (maxCount == undefined || (maxCount != undefined && parseInt(product.cost) <= maxCount))
    ) {
      htmlContentToAppend += `
        <div class="products" onclick="setProductID(${product.id})">
          <div class="product-img-div">
            <img class="product-img" src="${product.image}" alt="${product.description}">
          </div>
          <div class="product-name">
            <h4>${product.name}</h4>          
          </div>
          <div class="product-qty">
            <span class="text-muted">${product.soldCount} vendidos</span>
          </div>
          <div class="product-card-description">
            <p class="product-description">${product.description}</p>
          </div>
          <div class="product-price">
            <h4>${product.currency} ${product.cost}</h4>
          </div>          
        </div>
      `;
    }
  }
  document.querySelector("#productList").innerHTML = htmlContentToAppend;
}

function sortCategories(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_COST) {
    result = array.sort(function (a, b) {
      if (a.cost < b.cost) {
        return -1;
      }
      if (a.cost > b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_COST) {
    result = array.sort(function (a, b) {
      if (a.cost > b.cost) {
        return -1;
      }
      if (a.cost < b.cost) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_SOLD_COUNT) {
    result = array.sort(function (a, b) {
      //productCount cambiado por soldCount
      let aCount = parseInt(a.soldCount);
      let bCount = parseInt(b.soldCount);

      if (aCount > bCount) {
        return -1;
      }
      if (aCount < bCount) {
        return 1;
      }
      return 0;
    });
  }

  return result;
}

function sortAndShowProducts(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray != undefined) {
    currentProductsArray = categoriesArray;
  }

  currentProductsArray = sortCategories(currentSortCriteria, currentProductsArray);

  //Muestro los productos ordenados
  showProductList();
}

//Botones de filtro
document.querySelector("#sortAsc").onclick = () => {
  sortAndShowProducts(ORDER_ASC_BY_COST);
};

document.querySelector("#sortDesc").onclick = () => {
  sortAndShowProducts(ORDER_DESC_BY_COST);
};

document.querySelector("#sortBySold").onclick = () => {
  sortAndShowProducts(ORDER_BY_SOLD_COUNT);
};

document.querySelector("#clearRangeFilter").onclick = () => {
  document.querySelector("#rangeFilterCountMin").value = "";
  document.querySelector("#rangeFilterCountMax").value = "";

  minCount = undefined;
  maxCount = undefined;

  showProductList();
};

document.querySelector("#rangeFilterCount").onclick = () => {
  minCount = document.querySelector("#rangeFilterCountMin").value;
  maxCount = document.querySelector("#rangeFilterCountMax").value;

  if (minCount != undefined && minCount != "" && parseInt(minCount) >= 0) {
    minCount = parseInt(minCount);
  } else {
    minCount = undefined;
  }

  if (maxCount != undefined && maxCount != "" && parseInt(maxCount) >= 0) {
    maxCount = parseInt(maxCount);
  } else {
    maxCount = undefined;
  }

  showProductList();
};

// Función que se ejecuta al cargar la página.
document.addEventListener("DOMContentLoaded", function () {
  usuario = document.querySelector("#navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  document.querySelector("#log-out-btn").onclick = () => {
    localStorage.removeItem("nombreUsuario");
  };

  if (currentUser.profileImg !== "") {
    navbarProfImg.src = currentUser.profileImg;
  }

  // Agregué catID
  getJSONData(PRODUCTS_URL + window.localStorage.getItem("catID") + EXT_TYPE).then((resultado) => {
    if (resultado.status === "ok") {
      nombreCategoria = resultado.data.catName;
      currentProductsArray = resultado.data.products;
      document.querySelector("#nombreProducto").innerHTML = `
            Verás aquí todos los productos de la categoría <strong>${nombreCategoria}</strong></p>
            `;
      // Clono lista de productos
      initial = [...currentProductsArray];

      showProductList();
    }
  });

  // Buscador
  const searchBar = document.querySelector("#nav-search");
  searchBar.onkeyup = (e) => {
    currentProductsArray = initial.filter((product) => {
      return (
        product.name.toLowerCase().includes(e.target.value.toLowerCase().trim()) ||
        product.description.toLowerCase().includes(e.target.value.toLowerCase().trim())
      );
    });
    showProductList();
    console.log(e.target.value);
  };
});
