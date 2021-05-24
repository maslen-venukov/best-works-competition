const registerForm = document.querySelector('[data-form="register"]')
const loginForm = document.querySelector('[data-form="login"]')
const settingsForm = document.querySelector('[data-form="settings"]')
const sendWorkForm = document.querySelector('[data-form="send-work"]')
const logoutElem = document.querySelector('.logout')
const worksRemoveElem = document.querySelectorAll('.works__remove')

const toastTime = 4000

const toast = message => M.toast({ html: message })

const getFormData = e => {
  e.preventDefault()
  const elements = Array.from(e.target.elements)
  const inputs = elements.filter(el => el.nodeName === 'INPUT')
  const data = inputs.reduce((acc, input) => {
    const { name, value } = input
    return { ...acc, [name]: value }
  }, {})
  return data
}

const sidenavs = document.querySelectorAll('.sidenav')
const sidenavsInstances = M.Sidenav.init(sidenavs)

const selects = document.querySelectorAll('select')
const selectsInstances = M.FormSelect.init(selects)

if(registerForm) {
  registerForm.addEventListener('submit', async e => {
    const data = getFormData(e)
    try {
      const res = await axios.post('/api/users/register', data)
      toast(res.data.message)
      setTimeout(() => {
        window.location.replace('/me')
      }, toastTime)
    } catch (e) {
       toast(e.response.data.message)
    }
  })
}

if(loginForm) {
  loginForm.addEventListener('submit', async e => {
    const data = getFormData(e)
    try {
      await axios.post('/api/users/login', data)
      window.location.replace('/me')
    } catch (e) {
       toast(e.response.data.message)
    }
  })
}

if(settingsForm) {
  settingsForm.addEventListener('submit', async e => {
    const data = getFormData(e)
    try {
      const res = await axios.put('/api/users', data)
      toast(res.data.message)
    } catch (e) {
       toast(e.response.data.message)
    }
  })
}

if(sendWorkForm) {
  sendWorkForm.addEventListener('submit', async e => {
    e.preventDefault()
    const form = e.target
    const elements = Array.from(form.elements)
    const data = new FormData()
    data.append('name', elements[0].value)
    data.append('nomination', elements[2].value)
    data.append('file', elements[3].files[0])
    try {
      const res = await axios.post('/api/works', data)
      toast(res.data.message)
      form.reset()
    } catch (e) {
      toast(e.response.data.message)
    }
  })
}

if(logoutElem) {
  logoutElem.addEventListener('click', async e => {
    e.preventDefault()
    try {
      await axios.post('/api/users/logout')
      window.location.replace('/')
    } catch (e) {
      toast(e.response.data.message)
    }
  })
}

if(worksRemoveElem) {
  worksRemoveElem.forEach(el => {
    el.addEventListener('click', async e => {
      e.preventDefault()
      if(!window.confirm('Вы действительно хотите удалить работу?')) {
        return null
      }
      const parent = e.target.closest('[data-id]')
      const { id } = parent.dataset
      try {
        const res = await axios.delete(`/api/works/${id}`)
        toast(res.data.message)
        parent.remove()
      } catch (e) {
        toast(e.response.data.message)
      }
    })
  })
}