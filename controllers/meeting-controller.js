const { getUser } = require('../helpers/auth-helpers')

const meetingController = {
  getFivePage: (_, res) => {
    res.render('5th')
  },
  getSixPage: (_, res) => {
    res.render('6th')
  },
  getGroupPage: (req, res) => {
    const { group } = getUser(req)
    switch (group) {
      case '5th':
        res.redirect('/meetings/5th')
        break
      case '6th':
        res.redirect('/meetings/6th')
        break
      default:
        res.redirect('/meetings/5th')
    }
  }
}

module.exports = meetingController
