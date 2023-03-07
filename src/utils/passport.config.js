const passport = require('passport')
const local = require('passport-local')
const UsersModel = require('../dao/models/users.model')
const { passwordHash, passwordCompare } = require('./bcrypt')
const {
  STRATEGY_REGISTER,
  STRATEGY_LOGIN,
  STRATEGY_GITHUB,
  GITHUB_CLIENTID,
  GITHUB_SECRET,
} = require('./constants')
const GitHubStrategy = require('passport-github2')

const InitPassport = () => {
  //Register
  passport.use(
    STRATEGY_REGISTER,
    new local.Strategy(
      {
        passReqToCallback: true,
        usernameField: 'email',
      },
      async (req, username, password, done) => {
        const { firstName, lastName, age } = req.body
        try {
          const userExists = await UsersModel.findOne({ email: username })
          if (userExists) {
            done(null, false)
          } else {
            const hash = passwordHash(password)
            const user = await UsersModel.create({
              firstName,
              lastName,
              age,
              email: username,
              password: hash,
            })
            done(null, user)
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )

  //Login
  passport.use(
    STRATEGY_LOGIN,
    new local.Strategy(
      { usernameField: 'email' },
      async (username, password, done) => {
        try {
          const user = await UsersModel.findOne({ email: username })
          if (!user) {
            console.log('User doesn´t exists')
            done(null, false)
          }
          const isValidPassword = passwordCompare(password, user.password)
          if (!isValidPassword) {
            done(null, false)
          }
          done(null, user)
        } catch (error) {
          done(error)
        }
      }
    )
  )

  //Github Login
  passport.use(
    STRATEGY_GITHUB,
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENTID,
        clientSecret: GITHUB_SECRET,
        callbackURL: 'http://localhost:8080/api/sessions/callbackGithub',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile)
          let user = await UsersModel.findOne({ email: profile._json.email })
          if (!user) {
            user = {
              firstName: profile._json.name,
              lastName: '',
              age: 20,
              email: profile._json.email,
              password: '',
            }
            const newUser = await UsersModel.create(user)
            done(null, newUser)
          } else {
            done(null, user)
          }
        } catch (error) {
          done(error)
        }
      }
    )
  )

  //Serialize user
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  //Deserialize user
  passport.deserializeUser(async (id, done) => {
    const user = await UsersModel.findById(id)
    done(null, user)
  })
}

module.exports = { InitPassport }
