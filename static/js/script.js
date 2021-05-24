const registerForm = document.querySelector('[data-form="register"]')
const loginForm = document.querySelector('[data-form="login"]')
const logoutElem = document.querySelector('.logout')

const getFormData = e => {
  const elements = Array.from(e.target.elements)
  const inputs = elements.filter(el => el.nodeName === 'INPUT')
  const data = inputs.reduce((acc, input) => {
    const { name, value } = input
    return { ...acc, [name]: value }
  }, {})
  return data
}

document.addEventListener('DOMContentLoaded', function() {
  const sidenavs = document.querySelectorAll('.sidenav')
  const instances = M.Sidenav.init(sidenavs)
})

if(registerForm) {
  registerForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = getFormData(e)
    try {
      const res = await axios.post('/api/users/register', data)
      M.toast({ html: res.data.message })
      setTimeout(() => {
        window.location.replace('/me')
      }, 4000);
    } catch (e) {
       M.toast({ html: e.response.data.message })
    }
  })
}

if(loginForm) {
  loginForm.addEventListener('submit', async e => {
    e.preventDefault()
    const data = getFormData(e)
    try {
      await axios.post('/api/users/login', data)
      window.location.replace('/me')
    } catch (e) {
       M.toast({ html: e.response.data.message })
    }
  })
}

if(logoutElem) {
  logoutElem.addEventListener('click', async e => {
    e.preventDefault()
    try {
      await axios.get('/api/users/logout')
      window.location.replace('/')
    } catch (e) {
      M.toast({ html: e.response.data.message })
    }
  })
}