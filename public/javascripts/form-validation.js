const submitButton = document.querySelector('#submitButton')
const form = document.querySelector('#form')

try {
  submitButton.addEventListener('click', event => {
    form.classList.add('was-validated')
  })

  form.addEventListener('submit', event => {
    if (!form.checkValidity()) {
      event.stopPropagation()
      event.preventDefault()
      alert('Form invalid')
    } else {
      submitButton.disabled = true
    }
  })
} catch {}
