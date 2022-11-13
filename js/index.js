//User
const userID = window.localStorage.getItem("nombreUsuario");
const users = JSON.parse(window.localStorage.getItem("users"));
const currentUser = users[userID];
//Img de perfil
const navbarProfImg = document.querySelector("#nav-profile-img");

const hidden = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  /* Si no hay un usuario en el local storage se redirige a login */
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }
  /* Mostrar nombre de usuario */
  usuario = document.getElementById("navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  hidden.forEach((el) => {
    observer.observe(el);
  });

  document.getElementById("autos").addEventListener("click", function () {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function () {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function () {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });

  document.getElementById("log-out-btn").addEventListener("click", () => {
    localStorage.removeItem("nombreUsuario");
  });

  if (currentUser.profileImg !== "") {
    navbarProfImg.src = currentUser.profileImg;
  }
});
