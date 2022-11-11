
const formLogin = document.getElementById('formLogin');
const btnLogin = document.getElementById('btnLogin');

fetch('/dashboard')
  .then(resp => resp.json())
  .then(json => {    
    if(json.status === 'error'){      
    }else{
      location.replace('dashboard.html');
    }
  })

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();

  let obj = {};

  const data = new FormData(formLogin);
  data.forEach( (value, key) => obj[key] = value)

  fetch('/login', {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
        'Content-Type': 'application/json'
    }
  }).then(result => result.json())
    .then( resp => {      

      if(resp.status === 'error'){
        document.getElementById('msjError').innerHTML = resp.msg;
        document.getElementById('inputEmail').value = '';
        document.getElementById('inputPass').value = '';
        document.getElementById('inputEmail').focus();
        // Borro el mensaje a los 2 segundos
        setTimeout(() => {
          document.getElementById('msjError').innerHTML = '';
        }, 2000);

      }else {
        location.replace('./dashboard.html')
      }
    });
})