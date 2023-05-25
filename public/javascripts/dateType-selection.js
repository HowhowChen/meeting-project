const meeting = document.querySelector('#meeting')
const acceptance = document.querySelector('#acceptance')
const selectDateType = document.querySelector('#selectDateType')
const startDate = document.querySelector('#startDate')
const endDate = document.querySelector('#endDate')

try {
  meeting.addEventListener('change', e => {
    e.target.checked = true
    acceptance.checked = false
    selectDateType.value = 'meeting'

    startDate.classList.add('hide')
    endDate.classList.add('hide')
    setTimeout(() => {
      meetingSet()
    }, 300)
    setTimeout(() => {
      startDate.classList.remove('hide')
      endDate.classList.remove('hide')
    }, 300)
  })
  acceptance.addEventListener('change', e => {
    e.target.checked = true
    meeting.checked = false
    selectDateType.value = 'acceptance'

    startDate.classList.add('hide')
    endDate.classList.add('hide')
    setTimeout(() => {
      acceptanceSet()
    }, 300)
    setTimeout(() => {
      startDate.classList.remove('hide')
      endDate.classList.remove('hide')
    }, 300)
  })
} catch {}

function meetingSet () {
  startDate.innerText = '會議日期(起)📆'
  endDate.innerText = '會議日期(迄)📆'
}

function acceptanceSet () {
  startDate.innerText = '來料日期(起)📆'
  endDate.innerText = '來料日期(迄)📆'
}
