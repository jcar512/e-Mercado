const loginButton = document.querySelector("#loginButton");

document.addEventListener("DOMContentLoaded", function () {
  loginButton.onclick = () => {
    const email = document.querySelector("#typeEmailX-2");
    const pass = document.querySelector("#typePasswordX-2");

    if (email.value != "" && pass.value != "") {
      window.location.href = "index.html";
      window.localStorage.setItem("nombreUsuario", email.value);
    } else {
      document.querySelector("#email").innerHTML = `
      <input type="email" id="typeEmailX-2" class="form-control form-control-lg" />
      <label class="form-label" for="typeEmailX-2">Email</label>
      <p class="text-danger">Ingrese su email</p>
      `;
      email.classList.add("border-danger");

      document.querySelector("#password").innerHTML = `
      <input type="password" id="typePasswordX-2" class="form-control form-control-lg" />
      <label class="form-label" for="typePasswordX-2">Password</label>
      <p class="text-danger">Ingrese su contraseña</p>
      `;
      pass.classList.add("border-danger");
    }
  };
});

//Tengo que corregir todo esto
