const issue = document.querySelector('#issue')
const issueId = document.querySelector('#issueId')
const issueCategory = document.querySelector('#issue-category')
const option = document.querySelector('#issue-category option')
try {
  issue.addEventListener('change', e => { console.log(issue.value) })
} catch {}
