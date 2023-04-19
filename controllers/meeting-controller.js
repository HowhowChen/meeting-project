const meetingController = {
  getFivePage: (_, res) => {
    res.render('5th')
  },
  getSixPage: (_, res) => {
    res.render('6th')
  }
}

module.exports = meetingController
