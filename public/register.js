
const formRegister = document.getElementById('formRegister')
const btnRegister = document.getElementById('btnRegister')

btnRegister.addEventListener('click', (e) => {
  e.preventDefault();

  let obj = {};
  const data = new FormData(formRegister)
  data.forEach( (value, key) => obj[key] = value)

  fetch('/register', {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
        'Content-Type': 'application/json'
    }
  }).then(result => result.json())
    .then((resp) => {      

      if(resp.status === 'error' ) {
        document.getElementById('msjError').innerHTML = resp.msg;
        document.getElementById('inputName').value = '';
        document.getElementById('inputEmail').value = '';
        document.getElementById('inputPass').value = '';
        document.getElementById('inputName').focus();
        // Borro el mensaje a los 2 segundos
        setTimeout(() => {
          document.getElementById('msjError').innerHTML = '';
        }, 2000);

      }else {
        location.replace('./index.html')
      }
    })

})

// location.replace('./index.html')