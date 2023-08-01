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

try {
  // window load
  window.addEventListener('load', () => {
    country.value = countrySelect.value
    category.value = categorySelect.value
    countryTextBlock.classList.add('hidden')
    categoryTextBlock.classList.add('hidden')
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

    categoryText.required = false
    categorySelect.required = true

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

    // category select on change
    categorySelect.addEventListener('change', e => {
      category.value = e.target.value
    })

    // category text on change
    categoryText.addEventListener('change', e => {
      category.value = e.target.value
    })
  })
} catch {}
