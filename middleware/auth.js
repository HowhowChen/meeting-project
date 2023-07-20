const helpers = require('../helpers/auth-helpers')

module.exports = {
  authenticated: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) return next()
    req.flash('warning_messages', 'Please Login!')
    res.redirect('/users/login')
  },
  authenticatedAdmin: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req)?.role === 'admin') return next()
      res.redirect('/')
    } else {
      res.redirect('/users/login')
    }
  },
  authenticatedFiveClass: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req)?.group === '5th' || helpers.getUser(req)?.role === 'admin') return next()
      res.redirect('/')
    } else {
      res.redirect('/users/login')
    }
  },
  authenticatedSixClass: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req)?.group === '6th' || helpers.getUser(req)?.role === 'admin') return next()
      res.redirect('/')
    } else {
      res.redirect('/users/login')
    }
  },
  authenticatedSevenClass: (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req)?.group === '7th' || helpers.getUser(req)?.role === 'admin') return next()
      res.redirect('/')
    } else {
      res.redirect('/users/login')
    }
  },
  authenticatedUser: (req, res, next) => {
    const { id } = req.params
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).id === Number(id)) return next()
      res.redirect(`/users/${id}`)
    } else {
      res.redirect('/users/login')
    }
  }
}
