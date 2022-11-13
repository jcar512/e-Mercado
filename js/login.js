const loginButton = document.querySelector("#loginButton");

document.addEventListener("DOMContentLoaded", function () {
  loginButton.onclick = () => {
    if (window.localStorage.getItem("users") === null) {
      const users = {};
      window.localStorage.setItem("users", JSON.stringify(users));
    }

    const email = document.querySelector("#typeEmailX-2");
    const pass = document.querySelector("#typePasswordX-2");

    const users = JSON.parse(window.localStorage.getItem("users"));

    if (email.value != "" && pass.value != "") {
      window.location.href = "index.html";
      window.localStorage.setItem("nombreUsuario", email.value);

      //Guardo al usuario actual en caso de que aún no esté registrado
      if (users[window.localStorage.getItem("nombreUsuario")] === undefined) {
        const currentUser = {
          name: "",
          secondName: "",
          lastName: "",
          secondLastName: "",
          email: email.value,
          phone: "",
          profileImg: "",
        };

        users[email.value] = currentUser;

        window.localStorage.setItem("users", JSON.stringify(users));
      }
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
