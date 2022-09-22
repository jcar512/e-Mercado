document.addEventListener("DOMContentLoaded", () => {
  if (window.localStorage.getItem("nombreUsuario") == null) {
    window.location.href = "login.html";
  }

  usuario = document.getElementById("navbarDarkDropdownMenuLink");
  usuario.innerHTML = window.localStorage.getItem("nombreUsuario");

  document.getElementById("log-out-btn").addEventListener("click", () => {
    localStorage.removeItem("nombreUsuario");
  });
});
