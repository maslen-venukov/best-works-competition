const registerForm = document.querySelector('[data-form="register"]')
const loginForm = document.querySelector('[data-form="login"]')
const settingsForm = document.querySelector('[data-form="settings"]')
const sendWorkForm = document.querySelector('[data-form="send-work"]')
const admitWorkForm = document.querySelector('[data-form="admit-work"]')
const evaluateWorkForm = document.querySelector('[data-form="evaluate-work"]')
const logoutElem = document.querySelector('.logout')
const removeItemElems = document.querySelectorAll('[data-action="remove-item"]')
const editModalTriggers = document.querySelectorAll('[data-target="edit-modal"]')
const settingsNominationElem = document.querySelector('[data-settings-nomination]')
const editModal = document.querySelector('#edit-modal')

const toastTime = 3000

const toast = (message, displayLength = toastTime) => M.toast({ html: message, displayLength })

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

const getIdFromUrl = () => window.location.pathname.split('/').pop()

const initMaterialize = () => {
  const sidenavs = document.querySelectorAll('.sidenav')
  M.Sidenav.init(sidenavs)

  const selects = document.querySelectorAll('select')
  M.FormSelect.init(selects)

  const modals = document.querySelectorAll('.modal')
  M.Modal.init(modals)
}

initMaterialize()

if(registerForm) {
  registerForm.addEventListener('submit', async e => {
    const data = getFormData(e)
    try {
      const res = await axios.post('/api/users/register', data)
      toast(res.data.message)
      setTimeout(() => {
        window.location.replace('/profile')
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
      window.location.replace('/profile')
    } catch (e) {
       toast(e.response.data.message)
    }
  })
}

if(settingsForm) {
  settingsForm.addEventListener('submit', async e => {
    const data = getFormData(e)
    const select = Array.from(e.target.elements).find(el => el.nodeName === 'SELECT')
    if(select) {
      data.nomination = select.value
    }
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

if(admitWorkForm) {
  admitWorkForm.addEventListener('submit', async e => {
    e.preventDefault()
    if(!window.confirm('Вы действительно хотите выполнить проверку?')) {
      return null
    }
    const id = getIdFromUrl()
    const checkboxes = Array.from(e.target.querySelectorAll('input[type="checkbox"]'))
    const data = checkboxes.reduce((acc, checkbox) => {
      const { name, checked } = checkbox
      return { ...acc, [name]: checked }
    }, {})
    try {
      const res = await axios.post(`/api/technical-expertise/${id}`, data)
      const time = res.status === 201 ? toastTime : 8000
      toast(res.data.message, time)
      setTimeout(() => {
        window.location.replace('/admit')
      }, time)
    } catch (e) {
      toast(e.response.data.message)
    }
  })
}

if(evaluateWorkForm) {
  evaluateWorkForm.addEventListener('submit', async e => {
    e.preventDefault()
    const elements = Array.from(e.target.elements)
    const inputs = elements.filter(el => el.nodeName === 'INPUT')
    const workId = getIdFromUrl()
    const data = inputs.reduce((acc, input) => {
      const { id, value } = input
      const obj = {
        evaluationCriterion: id,
        value: Number(value)
      }
      return [...acc, obj]
    }, [])
    try {
      const res = await axios.post(`/api/expert-reviews/${workId}`, data)
      console.log(res)
      toast(res.data.message)
      setTimeout(() => {
        window.location.replace('/evaluate')
      }, toastTime)
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

if(removeItemElems) {
  removeItemElems.forEach(el => {
    el.addEventListener('click', async e => {
      e.preventDefault()
      const { target } = e
      if(!window.confirm('Вы действительно хотите удалить работу?')) {
        return null
      }
      const parent = target.closest('[data-id]')
      const collection = target.closest('ul.collection').classList[0]
      const { id } = parent.dataset
      try {
        const res = await axios.delete(`/api/${collection}/${id}`)
        toast(res.data.message)
        parent.remove()
      } catch (e) {
        toast(e.response.data.message)
      }
    })
  })
}

if(editModal) {
  editModal.addEventListener('submit', async e => {
    e.preventDefault()
    const elements = Array.from(e.target.elements)
    const { id } = editModal.dataset
    const role = elements[1].value
    try {
      const res = await axios.put(`/api/users/${id}`, { role })
      toast(res.data.message)
    } catch (e) {
      toast(e.response.data.message)
    }
  })
}

if(editModalTriggers) {
  editModalTriggers.forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault()
      const parent = e.target.closest('[data-id]')
      const { id, role } = parent.dataset
      editModal.dataset.id = id

      const item = document.querySelector(`[data-id="${id}"]`)
      const dropdown = editModal.querySelector('.select-dropdown ')
      const fullname = item.querySelector('[data-fullname]').textContent

      editModal.querySelector('h5').textContent = fullname
      editModal.querySelector('select').value = role

      switch(role) {
        case 'USER':
          dropdown.value = 'Участник'
          break

        case 'EXPERT':
          dropdown.value = 'Эксперт'
          break

        default:
          break
      }
    })
  })
}

if(settingsNominationElem) {
  const id = settingsNominationElem.dataset.settingsNomination
  const options = Array.from(settingsNominationElem.querySelectorAll('option'))
  const nomination = options.find(option => option.value === id).textContent
  settingsNominationElem.querySelector('input').value = nomination
}