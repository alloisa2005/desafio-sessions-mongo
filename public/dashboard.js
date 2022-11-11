
let spanUsername = document.getElementById('spanUsername');
let logout = document.getElementById('logout');

fetch('/dashboard')
  .then(resp => resp.json())
  .then(json => {    
    if(json.status === 'error'){
      location.replace('index.html');
    }else{
      document.getElementById('spanUsername').innerHTML = json.username;
    }
  })


logout.addEventListener('click', (e) => {
  e.preventDefault();

  fetch('/logout')
  .then(resp => resp.json())
  .then(json => {    
    if(json.status === 'error'){      
    }else{
      location.replace('index.html');
    }
  })
})
