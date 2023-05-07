const issue = document.querySelector('#issue')
const issueId = document.querySelector('#issueId')
const issueMessage = document.querySelector('#issue-message')
const options = document.querySelectorAll('datalist option')

try {
  issue.addEventListener('change', e => {
    let validation = false
    for (let i = 0; i < options.length; i++) {
      if (issue.value === options[i].value) {
        issueId.value = options[i].dataset.value
        validation = true
      }
    }
    issueMessage.classList.remove('text-success', 'text-danger')
    if (!validation) {
      issueMessage.classList.add('text-danger')
      issueMessage.innerText = '請輸入內建選項文字！'
      return
    }
    issueMessage.classList.add('text-success')
    issueMessage.innerText = '輸入正確！'
  })
} catch {}
