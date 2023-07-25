if (window.localStorage.getItem('nombreUsuario') === null) {
  window.location.href = 'login.html';
}

const profileForm = document.querySelector('#profile-form');

const userID = window.localStorage.getItem('nombreUsuario');
const users = JSON.parse(window.localStorage.getItem('users'));
const currentUser = users[userID];
let imgUrl = currentUser.profileImg;

const profileName = document.querySelector('#profile_name');
const profileSeconName = document.querySelector('#profile_second_name');
const profileLastname = document.querySelector('#profile_lastname');
const profileSecondLastname = document.querySelector(
  '#profile_second_lastname'
);
const profileEmail = document.querySelector('#profile_email');
const profilePhone = document.querySelector('#profile_phone');
const newProfileImg = document.querySelector('#new_profile_img');

const navbarProfImg = document.querySelector('#nav-profile-img');
const profileImg = document.querySelector('#profile-img');

const cleavePhone = new Cleave('#profile_phone', {
  numericOnly: true,
  blocks: [3, 3, 3],
});

function setError(element, message) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  element.classList.remove('is-valid');
  element.classList.add('is-invalid');
  errorDisplay.innerText = message;
}

function setSuccess(element) {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  element.classList.remove('is-invalid');
  errorDisplay.innerText = '';
}

function showErrors(errors) {
  Object.entries(errors).forEach(([input, error]) =>
    setError(document.getElementById(input), error)
  );
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function validate({ name, lastName, email, phone }) {
  const errors = {};

  if (name === '') {
    errors.profile_name = 'Debe ingresar su primer nombre.';
  } else {
    setSuccess(document.getElementById('profile_name'));
  }

  if (lastName === '') {
    errors.profile_lastname = 'Debe ingresar su primer apellido.';
  } else {
    setSuccess(document.getElementById('profile_lastname'));
  }

  if (email === '' || !validateEmail(email)) {
    errors.profile_email = 'Debe ingresar un email válido.';
  } else {
    setSuccess(document.getElementById('profile_email'));
  }

  if (phone === '') {
    errors.profile_phone = 'Debe ingresar su número de teléfono.';
  } else {
    setSuccess(document.getElementById('profile_phone'));
  }
  return errors;
}

document.addEventListener('DOMContentLoaded', () => {
  usuario = document.getElementById('navbarDarkDropdownMenuLink');
  usuario.innerHTML = window.localStorage.getItem('nombreUsuario');

  document.getElementById('log-out-btn').addEventListener('click', () => {
    localStorage.removeItem('nombreUsuario');
  });

  profileName.value = currentUser.name;
  profileSeconName.value = currentUser.secondName;
  profileLastname.value = currentUser.lastName;
  profileSecondLastname.value = currentUser.secondLastName;
  profileEmail.value = currentUser.email;
  profilePhone.value = currentUser.phone;
  if (currentUser.profileImg !== '') {
    navbarProfImg.src = currentUser.profileImg;
    profileImg.src = currentUser.profileImg;
  }

  document.querySelector('#closebtn').onclick = () => {
    let div = document.querySelector('#closebtn').parentElement;
    div.style.opacity = '0';
    setTimeout(function () {
      div.classList.remove('show');
      div.style.display = 'none';
    }, 600);
  };

  newProfileImg.onchange = () => {
    const fileRead = new FileReader();

    console.log(newProfileImg.files);

    fileRead.readAsDataURL(newProfileImg.files[0]);

    fileRead.addEventListener('load', () => {
      console.log(fileRead.result);

      imgUrl = fileRead.result;

      profileImg.src = imgUrl;
    });
  };

  profileForm.onsubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const values = {
      name: formData.get('profile_name'),
      secondName: formData.get('profile_second_name'),
      lastName: formData.get('profile_lastname'),
      secondLastName: formData.get('profile_second_lastname'),
      email: formData.get('profile_email'),
      phone: formData.get('profile_phone'),
      profileImg: imgUrl,
    };

    const errors = validate(values);

    if (Object.keys(errors).length > 0) {
      showErrors(errors);
    }

    if (profileForm.checkValidity() && Object.keys(errors).length === 0) {
      if (values.email !== window.localStorage.getItem('nombreUsuario')) {
        usuario.innerText = values.email;
        window.localStorage.setItem('nombreUsuario', values.email);
        users[values.email] = values;

        delete users[userID];
      } else {
        users[userID] = values;
      }

      if (values.profileImg !== '') {
        navbarProfImg.src = values.profileImg;
      }

      window.localStorage.setItem('users', JSON.stringify(users));

      document.querySelector('#alert').style.opacity = '100';
      document.querySelector('#alert').style.display = 'block';
      setTimeout(function () {
        document.querySelector('#alert').classList.add('show');
      }, 30);
    }
  };
});
