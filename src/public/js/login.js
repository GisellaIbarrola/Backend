const formLogin = document.getElementById('formLogin')
const email = document.getElementById('email')
const password = document.getElementById('password')
const forgotPassword = document.getElementById('forgot-password')

formLogin.addEventListener('submit', (e) => {
  e.preventDefault()

  fetch('/api/sessions/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: email.value, password: password.value }),
  })
    .then((res) => res.json())
    .then((data) => {
      window.alert(`Bienvenido ${data.user.firstName}`)
      window.location.href = '/products'
    })
    .catch((err) => {
      window.alert('Error al iniciar sesion')
    })
})

forgotPassword.addEventListener('click', (e)=>{
  e.preventDefault()
  window.location.href = '/forgot-password'
})
