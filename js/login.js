//Creo users en el local storage en caso de que no exista
if (window.localStorage.getItem('users') === null) {
  const users = {};
  window.localStorage.setItem('users', JSON.stringify(users));
}

//Usuarios
const users = JSON.parse(window.localStorage.getItem('users'));

//Form
const loginForm = document.querySelector('#login-form');

//Inputs
const loginInput = document.querySelector('#loginEmail');
const passwordInput = document.querySelector('#loginPassword');

//Añade mensajes de error y bordes en rojo
function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  element.classList.remove('is-valid');
  element.classList.add('is-invalid');
  errorDisplay.innerText = message;
}

//Quita mensaje de error y bordes rojos
function setSuccess(element) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  element.classList.remove('is-invalid');
  errorDisplay.innerText = '';
}

//Llama a setError por cada error pasado
function showErrors(errors) {
  Object.entries(errors).forEach(([input, error]) =>
    setError(document.getElementById(input), error)
  );
}

//-------------------------Validaciones-----------------------------------
function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validate({ loginEmail, loginPassword }) {
  const errors = {};

  if (loginEmail === '' || !validateEmail(loginEmail)) {
    errors.loginEmail = 'Debe ingresar un email válido.';
  } else {
    setSuccess(loginInput);
  }

  if (loginPassword === '' && loginEmail !== '') {
    errors.loginPassword = 'Debe ingresar su contraseña.';
  } else {
    setSuccess(passwordInput);
  }
  return errors;
}

/* ------------------------------------------------------------------------ */

document.addEventListener('DOMContentLoaded', function () {
  loginInput.value = 'user@gmail.com';
  passwordInput.value = 'asdasd';

  loginForm.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = {
      loginEmail: formData.get('loginEmail'),
      loginPassword: formData.get('loginPassword'),
    };

    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
    }

    if (loginForm.checkValidity() && Object.keys(errors).length === 0) {
      window.location.href = 'index.html';
      window.localStorage.setItem('nombreUsuario', values.loginEmail);

      //Guardo al usuario actual en caso de que aún no esté registrado
      if (users[window.localStorage.getItem('nombreUsuario')] === undefined) {
        const currentUser = {
          name: '',
          secondName: '',
          lastName: '',
          secondLastName: '',
          email: values.loginEmail,
          phone: '',
          profileImg: '',
        };

        users[values.loginEmail] = currentUser;

        window.localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };
});
