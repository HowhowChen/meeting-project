const countryTextBlock = document.querySelector('#countryTextBlock')
const countrySelectBlock = document.querySelector('#countrySelectBlock')
const countryText = document.querySelector('#countryText')
const countrySelect = document.querySelector('#countrySelect')
const countryIsTrue = document.querySelector('#countryIsTrue')
const countryIsFalse = document.querySelector('#countryIsFalse')
const country = document.querySelector('#country')

const categoryTextBlock = document.querySelector('#categoryTextBlock')
const categorySelectBlock = document.querySelector('#categorySelectBlock')
const categoryText = document.querySelector('#categoryText')
const categorySelect = document.querySelector('#categorySelect')
const categoryIsTrue = document.querySelector('#categoryIsTrue')
const categoryIsFalse = document.querySelector('#categoryIsFalse')
const category = document.querySelector('#category')

const platformTextBlock = document.querySelector('#platformTextBlock')
const platformSelectBlock = document.querySelector('#platformSelectBlock')
const platformText = document.querySelector('#platformText')
const platformSelect = document.querySelector('#platformSelect')
const platformIsTrue = document.querySelector('#platformIsTrue')
const platformIsFalse = document.querySelector('#platformIsFalse')
const platform = document.querySelector('#platform')

try {
  // window load
  window.addEventListener('load', () => {
    country.value = countrySelect.value
    category.value = categorySelect.value
    platform.value = platformSelect.value
    countryTextBlock.classList.add('hidden')
    categoryTextBlock.classList.add('hidden')
    platformTextBlock.classList.add('hidden')
  })

  // country is true
  countryIsTrue.addEventListener('change', e => {
    e.target.checked = true
    countryIsFalse.checked = false
    country.value = countrySelect.value

    countryText.required = false
    countrySelect.required = true

    countryTextBlock.classList.add('hide')
    countrySelectBlock.classList.add('hide')
    setTimeout(() => {
      countrySelectBlock.classList.remove('hidden')
      countryTextBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      countryTextBlock.classList.remove('hide')
      countrySelectBlock.classList.remove('hide')
    }, 300)
  })
  // country is false
  countryIsFalse.addEventListener('change', e => {
    e.target.checked = true
    countryIsTrue.checked = false

    countryText.required = true
    countrySelect.required = false

    countryTextBlock.classList.add('hide')
    countrySelectBlock.classList.add('hide')
    setTimeout(() => {
      countryTextBlock.classList.remove('hidden')
      countrySelectBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      countryTextBlock.classList.remove('hide')
      countrySelectBlock.classList.remove('hide')
    }, 300)
  })

  // country select on change
  countrySelect.addEventListener('change', e => {
    country.value = e.target.value
  })

  // country text on change
  countryText.addEventListener('change', e => {
    country.value = e.target.value
  })

  // category is true
  categoryIsTrue.addEventListener('change', e => {
    e.target.checked = true
    categoryIsFalse.checked = false
    category.value = categorySelect.value

    categoryText.required = false
    categorySelect.required = true

    categoryTextBlock.classList.add('hide')
    categorySelectBlock.classList.add('hide')
    setTimeout(() => {
      categorySelectBlock.classList.remove('hidden')
      categoryTextBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      categoryTextBlock.classList.remove('hide')
      categorySelectBlock.classList.remove('hide')
    }, 300)
  })
  // category is false
  categoryIsFalse.addEventListener('change', e => {
    e.target.checked = true
    categoryIsTrue.checked = false

    categoryText.required = true
    categorySelect.required = false

    categoryTextBlock.classList.add('hide')
    categorySelectBlock.classList.add('hide')
    setTimeout(() => {
      categoryTextBlock.classList.remove('hidden')
      categorySelectBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      categoryTextBlock.classList.remove('hide')
      categorySelectBlock.classList.remove('hide')
    }, 300)
  })
  // category select on change
  categorySelect.addEventListener('change', e => {
    category.value = e.target.value
  })

  // category text on change
  categoryText.addEventListener('change', e => {
    category.value = e.target.value
  })

  // platform is true
  platformIsTrue.addEventListener('change', e => {
    e.target.checked = true
    platformIsFalse.checked = false
    platform.value = platformSelect.value

    platformText.required = false
    platformSelect.required = true

    platformTextBlock.classList.add('hide')
    platformSelectBlock.classList.add('hide')
    setTimeout(() => {
      platformSelectBlock.classList.remove('hidden')
      platformTextBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      platformTextBlock.classList.remove('hide')
      platformSelectBlock.classList.remove('hide')
    }, 300)
  })

  // platform is false
  platformIsFalse.addEventListener('change', e => {
    e.target.checked = true
    platformIsTrue.checked = false

    platformText.required = true
    platformSelect.required = false

    platformTextBlock.classList.add('hide')
    platformSelectBlock.classList.add('hide')
    setTimeout(() => {
      platformTextBlock.classList.remove('hidden')
      platformSelectBlock.classList.add('hidden')
    }, 300)
    setTimeout(() => {
      platformTextBlock.classList.remove('hide')
      platformSelectBlock.classList.remove('hide')
    }, 300)
  })

  // platform select on change
  platformSelect.addEventListener('change', e => {
    platform.value = e.target.value
  })

  // platform text on change
  platformText.addEventListener('change', e => {
    platform.value = e.target.value
  })
} catch {}
