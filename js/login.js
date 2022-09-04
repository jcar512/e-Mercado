let loginButton = document.getElementById("loginButton")

document.addEventListener("DOMContentLoaded", function () {
  loginButton.addEventListener("click", function () {
    let email = document.getElementById("typeEmailX-2");
    let pass = document.getElementById("typePasswordX-2");
    
    if (email.value != "" && pass.value != "") {
      window.location.href = "index.html";
      window.localStorage.setItem("nombreUsuario", email.value)
    } else {
      document.getElementById("email").innerHTML = `
      <input type="email" id="typeEmailX-2" class="form-control form-control-lg" />
      <label class="form-label" for="typeEmailX-2">Email</label>
      <p class="text-danger">Ingrese su email</p>
      `;
      email.classList.add("border-danger");

      document.getElementById("password").innerHTML = `
      <input type="password" id="typePasswordX-2" class="form-control form-control-lg" />
      <label class="form-label" for="typePasswordX-2">Password</label>
      <p class="text-danger">Ingrese su contraseña</p>
      `;
      pass.classList.add("border-danger");
    }
  });
});

