const ORDER_ASC_BY_COST = "09";
const ORDER_DESC_BY_COST = "90";
const ORDER_BY_SOLD_COUNT = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;
let initial;

function showProductList() {
  let htmlContentToAppend = "";

  for (let product of currentProductsArray) {
    if (
      (minCount == undefined ||
        (minCount != undefined && parseInt(product.cost) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(product.cost) <= maxCount))
    ) {
      htmlContentToAppend += `
              <div onclick="setCatID(${product.id})" class="list-group-item list-group-item-action cursor-active">
                  <div class="row">
                      <div class="col-3">
                          <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
                      </div>
                      <div class="col">
                          <div class="d-flex w-100 justify-content-between">
                              <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost} </h4>
                              <small class="text-muted">${product.soldCount} vendidos</small>
                          </div>
                          <p class="mb-1">${product.description}</p>
                      </div>
                  </div>
              </div>
          `;
    }
  }
  document.getElementById("productList").innerHTML = htmlContentToAppend;
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

  currentProductsArray = sortCategories(
    currentSortCriteria,
    currentProductsArray
  );

  //Muestro las categorías ordenadas
  showProductList();
}


// Función que se ejecuta al cargar la página.
document.addEventListener("DOMContentLoaded", function () {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  usuario = document.getElementById("usuario");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  // Agregué catID 
  getJSONData(
    PRODUCTS_URL + window.localStorage.getItem("catID") + EXT_TYPE
  ).then((resultado) => {
    if (resultado.status === "ok") {
      nombreCategoria = resultado.data.catName;
      currentProductsArray = resultado.data.products;
      document.getElementById("nombreProducto").innerHTML = `
            Verás aquí todos los productos de la categoría <strong>${nombreCategoria}</strong></p>
            `;
      // Clono lista de productos
      initial = [...currentProductsArray];
      
      showProductList();
    }
  });

  document.getElementById("sortAsc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_ASC_BY_COST);
  });

  document.getElementById("sortDesc").addEventListener("click", function () {
    sortAndShowProducts(ORDER_DESC_BY_COST);
  });

  document.getElementById("sortBySold").addEventListener("click", function () {
    sortAndShowProducts(ORDER_BY_SOLD_COUNT);
  });

  document
    .getElementById("clearRangeFilter")
    .addEventListener("click", function () {
      document.getElementById("rangeFilterCountMin").value = "";
      document.getElementById("rangeFilterCountMax").value = "";

      minCount = undefined;
      maxCount = undefined;

      showProductList();
    });

  document
    .getElementById("rangeFilterCount")
    .addEventListener("click", function () {
      minCount = document.getElementById("rangeFilterCountMin").value;
      maxCount = document.getElementById("rangeFilterCountMax").value;

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
    });

  // Buscador
  let searchBar = document.getElementById("nav-search");
  searchBar.onkeyup = (e) => {
    currentProductsArray = initial.filter((product) => {
      return (
        product.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
        product.description.toLowerCase().includes(e.target.value.toLowerCase())
      );
    });
    showProductList();
    console.log(e.target.value);
  };
});

