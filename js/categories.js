if (window.localStorage.getItem('nombreUsuario') === null) {
  window.location.href = 'login.html';
}

const ORDER_ASC_BY_NAME = 'AZ';
const ORDER_DESC_BY_NAME = 'ZA';
const ORDER_BY_PROD_COUNT = 'Cant.';
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

const userID = window.localStorage.getItem('nombreUsuario');
const users = JSON.parse(window.localStorage.getItem('users'));
const currentUser = users[userID];

const navbarProfImg = document.querySelector('#nav-profile-img');

function sortCategories(criteria, array) {
  let result = [];
  if (criteria === ORDER_ASC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_DESC_BY_NAME) {
    result = array.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  } else if (criteria === ORDER_BY_PROD_COUNT) {
    result = array.sort(function (a, b) {
      let aCount = parseInt(a.productCount);
      let bCount = parseInt(b.productCount);

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

function setCatID(id) {
  localStorage.setItem('catID', id);
  window.location = 'products.html';
}

function showCategoriesList() {
  let htmlContentToAppend = '';
  for (let i = 0; i < currentCategoriesArray.length; i++) {
    let category = currentCategoriesArray[i];

    if (
      (minCount == undefined ||
        (minCount != undefined &&
          parseInt(category.productCount) >= minCount)) &&
      (maxCount == undefined ||
        (maxCount != undefined && parseInt(category.productCount) <= maxCount))
    ) {
      htmlContentToAppend += `
          <div class="products" onclick="setCatID(${category.id})">
            <div class="product-img-div">
              <img class="product-img" src="${category.imgSrc}" alt="${category.description}">
            </div>
            <div class="product-name">
              <h4>${category.name}</h4>          
            </div>
            <div class="product-qty">
              <span class="text-muted">${category.productCount} vendidos</span>
            </div>
            <div class="product-card-description">
              <p class="product-description">${category.description}</p>
            </div>                   
          </div>
        `;
    }

    document.getElementById('cat-list-container').innerHTML =
      htmlContentToAppend;
  }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
  currentSortCriteria = sortCriteria;

  if (categoriesArray != undefined) {
    currentCategoriesArray = categoriesArray;
  }

  currentCategoriesArray = sortCategories(
    currentSortCriteria,
    currentCategoriesArray
  );

  showCategoriesList();
}

document.addEventListener('DOMContentLoaded', (e) => {
  usuario = document.getElementById('navbarDarkDropdownMenuLink');
  usuario.innerHTML = window.localStorage.getItem('nombreUsuario');

  document.getElementById('log-out-btn').addEventListener('click', () => {
    localStorage.removeItem('nombreUsuario');
  });

  if (currentUser.profileImg !== '') {
    navbarProfImg.src = currentUser.profileImg;
  }

  getJSONData(CATEGORIES_URL).then(function (resultObj) {
    if (resultObj.status === 'ok') {
      currentCategoriesArray = resultObj.data;
      showCategoriesList();
    }
  });

  document.getElementById('sortAsc').addEventListener('click', function () {
    sortAndShowCategories(ORDER_ASC_BY_NAME);
  });

  document.getElementById('sortDesc').addEventListener('click', function () {
    sortAndShowCategories(ORDER_DESC_BY_NAME);
  });

  document.getElementById('sortByCount').addEventListener('click', function () {
    sortAndShowCategories(ORDER_BY_PROD_COUNT);
  });

  document
    .getElementById('clearRangeFilter')
    .addEventListener('click', function () {
      document.getElementById('rangeFilterCountMin').value = '';
      document.getElementById('rangeFilterCountMax').value = '';

      minCount = undefined;
      maxCount = undefined;

      showCategoriesList();
    });

  document
    .getElementById('rangeFilterCount')
    .addEventListener('click', function () {
      minCount = document.getElementById('rangeFilterCountMin').value;
      maxCount = document.getElementById('rangeFilterCountMax').value;

      if (minCount != undefined && minCount != '' && parseInt(minCount) >= 0) {
        minCount = parseInt(minCount);
      } else {
        minCount = undefined;
      }

      if (maxCount != undefined && maxCount != '' && parseInt(maxCount) >= 0) {
        maxCount = parseInt(maxCount);
      } else {
        maxCount = undefined;
      }

      showCategoriesList();
    });
});
