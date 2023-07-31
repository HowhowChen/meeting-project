const countryText = document.querySelector('#countryText')
const countrySelect = document.querySelector('#countrySelect')
const countryIsTrue = document.querySelector('#countryIsTrue')
const countryIsFalse = document.querySelector('#countryIsFalse')

const categoryText = document.querySelector('#categoryText')
const categorySelect = document.querySelector('#categorySelect')
const categoryIsTrue = document.querySelector('#categoryIsTrue')
const categoryIsFalse = document.querySelector('#categoryIsFalse')

try {
  // country is true
  countryIsTrue.addEventListener('change', e => {
    e.target.checked = true
    countryIsFalse.checked = false

    countryText.classList.add('hide')
    countrySelect.classList.add('hide')
    setTimeout(() => {
      countrySelect.classList.remove('hidden')
      countryText.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      countryText.classList.remove('hide')
      countrySelect.classList.remove('hide')
    }, 300)
  })
  // country is false
  countryIsFalse.addEventListener('change', e => {
    e.target.checked = true
    countryIsTrue.checked = false

    countryText.classList.add('hide')
    countrySelect.classList.add('hide')
    setTimeout(() => {
      countryText.classList.remove('hidden')
      countrySelect.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      countryText.classList.remove('hide')
      countrySelect.classList.remove('hide')
    }, 300)
  })

  // category is true
  categoryIsTrue.addEventListener('change', e => {
    e.target.checked = true
    categoryIsFalse.checked = false

    categoryText.classList.add('hide')
    categorySelect.classList.add('hide')
    setTimeout(() => {
      categorySelect.classList.remove('hidden')
      categoryText.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      categoryText.classList.remove('hide')
      categorySelect.classList.remove('hide')
    }, 300)
  })
  // category is false
  categoryIsFalse.addEventListener('change', e => {
    e.target.checked = true
    categoryIsTrue.checked = false

    categoryText.classList.add('hide')
    categorySelect.classList.add('hide')
    setTimeout(() => {
      categoryText.classList.remove('hidden')
      categorySelect.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      categoryText.classList.remove('hide')
      categorySelect.classList.remove('hide')
    }, 300)
  })
} catch {}
